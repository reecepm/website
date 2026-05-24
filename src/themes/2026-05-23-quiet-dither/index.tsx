import { useCallback, useEffect, useRef, useState } from 'react';
import { ContentProvider, Blog } from '@/theme-runtime/content';
import { useColorScheme } from '@/theme-runtime/prefs';
import type { ThemeComponentProps } from '@/themes/manifest';
import type { BlogEntry, ColorScheme } from '@/theme-runtime/types';
import { getColors } from './palette';
import { meta } from './meta';
import Navigator from './Navigator';
import AmbientField from './AmbientField';
import RippleField from './RippleField';
import DevelopTransition from './DevelopTransition';
import Landing from './Landing';
import './theme.css';

const initialSlug = `${meta.date}-${meta.id}`;

const monthYear = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const matchBlogPostPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/blog\/(.+?)\/?$/);
  return m ? m[1] : null;
};

const Header = () => (
  <header className="flex items-baseline justify-between">
    <a href="/" className="qd-mono text-[13px] text-[var(--qd-text)] no-underline hover:text-[var(--qd-accent)] transition-colors">
      reece.so
    </a>
    <a href="/blog" className="qd-mono text-[13px] text-[var(--qd-muted)] no-underline hover:text-[var(--qd-accent)] transition-colors">
      writing
    </a>
  </header>
);

const Rule = () => <hr className="h-px border-0 bg-[var(--qd-line)] m-0" />;

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-[600px] px-6 pt-[clamp(2.5rem,7vh,5rem)] pb-24">{children}</div>
);

const BlogIndexView = () => {
  const posts = Blog.useAll();
  return (
    <div className="flex flex-col gap-10">
      <Header />
      <section className="flex flex-col gap-2">
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--qd-text)]">Writing</h1>
        <p className="text-[14px] text-[var(--qd-muted)]">Notes on systems, tooling, and AI.</p>
      </section>
      <Rule />
      {posts.length === 0 ? (
        <p className="qd-mono text-[13px] text-[var(--qd-muted)]">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <a key={post.id} href={`/blog/${post.id}`} className="flex flex-col gap-0.5 no-underline group">
              <span className="text-[14px] text-[var(--qd-text)] group-hover:text-[var(--qd-accent)] transition-colors">
                {post.title}
              </span>
              <span className="qd-mono text-[12px] text-[var(--qd-muted)]">
                {monthYear(post.date)}
                {post.description ? ` · ${post.description}` : ''}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const BlogPostView = ({ post }: { post: BlogEntry }) => (
  <div className="flex flex-col gap-8">
    <Header />
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--qd-text)]">
          {post.title}
        </h1>
        <time dateTime={post.date.toISOString()} className="qd-mono text-[12px] text-[var(--qd-muted)]">
          {monthYear(post.date)}
        </time>
      </header>
      <div className="qd-prose" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
    <a
      href="/blog"
      className="qd-mono text-[13px] text-[var(--qd-muted)] no-underline hover:text-[var(--qd-accent)] transition-colors"
    >
      ← all writing
    </a>
  </div>
);

const NotFoundView = ({ title }: { title: string }) => (
  <div className="flex flex-col gap-8">
    <Header />
    <p className="qd-mono text-[13px] text-[var(--qd-muted)]">{title}</p>
    <a href="/" className="qd-mono text-[13px] text-[var(--qd-accent)] no-underline">
      ← home
    </a>
  </div>
);

const renderView = (path: string, content: ThemeComponentProps['content']) => {
  const postId = matchBlogPostPath(path);
  const post = postId ? content.blog.find((p) => p.id === postId) : undefined;
  if (post) return <PageContainer><BlogPostView post={post} /></PageContainer>;
  if (postId) return <PageContainer><NotFoundView title="Post not found." /></PageContainer>;
  if (path === '/blog') return <PageContainer><BlogIndexView /></PageContainer>;
  return <Landing />;
};

export default function QuietDither({ content, pathname }: ThemeComponentProps) {
  const [scheme, setScheme] = useColorScheme(meta.defaultColorScheme ?? 'dark');
  const colors = getColors(scheme);

  // Route content AND the colour scheme are held until the develop transition
  // covers the page, so the swap happens behind the dither and the new state
  // develops back in. `trigger` bumps for every transition — route change OR
  // theme toggle — so the animation is identical and in-sync in both cases.
  const [displayPath, setDisplayPath] = useState(pathname);
  const [trigger, setTrigger] = useState(0);
  const pending = useRef<{ path?: string; scheme?: ColorScheme }>({});

  // setScheme from useColorScheme isn't memoized; hold it in a ref so onCovered
  // stays referentially stable and never restarts the transition effect.
  const setSchemeRef = useRef(setScheme);
  setSchemeRef.current = setScheme;

  useEffect(() => {
    if (pathname === displayPath) return;
    pending.current.path = pathname;
    setTrigger((t) => t + 1);
  }, [pathname, displayPath]);

  const onCovered = useCallback(() => {
    const p = pending.current;
    pending.current = {};
    if (p.path != null) {
      setDisplayPath(p.path);
      window.scrollTo(0, 0);
    }
    if (p.scheme != null) {
      setSchemeRef.current(p.scheme);
    }
  }, []);

  const toggleTheme = () => {
    pending.current.scheme = scheme === 'dark' ? 'light' : 'dark';
    setTrigger((t) => t + 1);
  };

  return (
    <ContentProvider content={content}>
      <AmbientField colors={colors} />

      <div className="qd-page">{renderView(displayPath, content)}</div>

      <RippleField colors={colors} />
      <DevelopTransition colors={colors} trigger={trigger} onCovered={onCovered} />

      <Navigator
        initialSlug={initialSlug}
        about={content.about}
        scheme={scheme}
        onToggleTheme={toggleTheme}
      />
    </ContentProvider>
  );
}
