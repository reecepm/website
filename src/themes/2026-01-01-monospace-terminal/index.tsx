import { useEffect, useRef, useState } from 'react';
import { ContentProvider, Reece, Experience, Projects, Blog, Socials } from '@/theme-runtime/content';
import { useColorScheme } from '@/theme-runtime/prefs';
import type { ThemeComponentProps } from '@/themes/manifest';
import type { BlogEntry } from '@/theme-runtime/types';
import { runScrambleIn } from './scramble-in';
import { meta } from './meta';
import Navigator from './Navigator';
import './theme.css';

const initialSlug = `${meta.date}-${meta.id}`;

const formatFullDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const socialIcons: Record<string, string> = {
  github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path></svg>`,
  twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`,
  email: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M22 6L12 13L2 6"></path></svg>`,
  linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>`,
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
};

const SectionMarker = ({ n }: { n: string }) => (
  <div className="flex flex-col items-center gap-2 pt-1 max-md:flex-row">
    <span className="w-px h-6 bg-[var(--mt-border)] max-md:w-6 max-md:h-px"></span>
    <span className="font-mono text-[11px] text-[var(--mt-muted)] [writing-mode:vertical-rl] max-md:[writing-mode:horizontal-tb]">{n}</span>
  </div>
);

const ThemeToggle = () => {
  const [scheme, setScheme] = useColorScheme('light');
  const isDark = scheme === 'dark';
  return (
    <button
      onClick={() => setScheme(isDark ? 'light' : 'dark')}
      className="p-2 border border-[var(--mt-border)] text-[var(--mt-muted)] hover:text-[var(--mt-accent)] hover:border-[var(--mt-accent)] transition-all cursor-pointer bg-transparent"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
};

const Body = () => {
  const scrambleRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  useEffect(() => {
    if (!scrambleRef.current) return;
    const cleanup = runScrambleIn(scrambleRef.current);
    return cleanup;
  }, []);

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const profile = Reece.useProfile();

  return (
    <div className="max-w-[640px] mx-auto px-6 py-12 md:py-16" data-scramble-in ref={scrambleRef}>
      <header className="flex justify-between items-center mb-16 pb-6 border-b border-[var(--mt-border)]">
        <div className="font-mono text-sm flex items-center gap-0.5">
          <span className="text-[var(--mt-muted)]">~/</span>
          <span className="text-[var(--mt-text)] font-medium">reece-martin</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="/blog" className="font-mono text-sm text-[var(--mt-muted)] hover:text-[var(--mt-accent)] transition-colors">blog</a>
          <ThemeToggle />
        </nav>
      </header>

      <section className="mb-12 pb-12 border-b border-[var(--mt-border)]">
        <h1 className="font-mono text-[28px] font-semibold text-[var(--mt-text)] mb-2 tracking-tight">{profile.name}</h1>
        <p className="text-base text-[var(--mt-muted)] mb-6">{profile.role}</p>
        <div className="flex flex-wrap gap-6 max-md:flex-col max-md:gap-3">
          <span className="flex items-center gap-2 font-mono text-[13px]">
            <span className="text-[var(--mt-accent)]">location:</span>
            <span className="text-[var(--mt-text-secondary)]">{profile.location}</span>
          </span>
          <span className="flex items-center gap-2 font-mono text-[13px]">
            <span className="text-[var(--mt-accent)]">focus:</span>
            <span className="text-[var(--mt-text-secondary)]">{profile.focus}</span>
          </span>
        </div>
      </section>

      <section className="flex gap-6 mb-12 max-md:flex-col max-md:gap-4">
        <SectionMarker n="01" />
        <div className="flex-1">
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--mt-muted)] mb-5">About</h2>
          <p className="text-[15px] text-[var(--mt-text-secondary)] leading-relaxed">{profile.bio}</p>
        </div>
      </section>

      <section className="flex gap-6 mb-12 max-md:flex-col max-md:gap-4">
        <SectionMarker n="02" />
        <div className="flex-1">
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--mt-muted)] mb-5">Experience</h2>
          <div className="flex flex-col gap-px bg-[var(--mt-border)] border border-[var(--mt-border)]">
            <Experience.List>
              {(exp, i) => (
                <div
                  key={i}
                  className={`bg-[var(--mt-bg)] hover:bg-[var(--mt-bg-elevated)] cursor-pointer transition-colors group ${expanded.has(i) ? 'expanded' : ''}`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    toggleExpanded(i);
                  }}
                >
                  <div className="flex justify-between items-baseline px-5 py-4 gap-4 max-md:flex-col max-md:gap-1 max-md:px-4 max-md:py-3.5">
                    <span className="font-mono text-[15px] font-medium text-[var(--mt-text)]">{exp.company}</span>
                    <span className="flex items-baseline gap-3 font-mono text-[13px] max-md:flex-col max-md:gap-0.5">
                      <span className="text-[var(--mt-muted)]">{exp.role}</span>
                      <span className="text-[var(--mt-muted)] opacity-70">{exp.dateRange}</span>
                    </span>
                  </div>
                  {expanded.has(i) && (
                    <div className="block px-5 pb-5 border-t border-dashed border-[var(--mt-border)] -mt-px max-md:px-4 max-md:pb-4">
                      <p className="text-sm text-[var(--mt-text-secondary)] leading-relaxed mt-4 mb-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[11px] px-2 py-1 bg-[var(--mt-tag-bg)] text-[var(--mt-tag-text)] border border-[var(--mt-border)]">{tag}</span>
                        ))}
                      </div>
                      {exp.url && (
                        <a href={exp.url} className="inline-flex items-center gap-1 mt-3 font-mono text-[13px] text-[var(--mt-accent)] hover:text-[var(--mt-accent-hover)] hover:gap-2 transition-all no-underline" target="_blank" rel="noopener noreferrer">
                          Visit website &rarr;
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Experience.List>
          </div>
        </div>
      </section>

      <section className="flex gap-6 mb-12 max-md:flex-col max-md:gap-4">
        <SectionMarker n="03" />
        <div className="flex-1">
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--mt-muted)] mb-5">Experiments</h2>
          {Projects.useAll().length > 0 ? (
            <div className="flex flex-col gap-px bg-[var(--mt-border)] border border-[var(--mt-border)]">
              <Projects.List>
                {(exp, i) => (
                  <a key={i} href={exp.url || '#'} className="block p-5 bg-[var(--mt-bg)] hover:bg-[var(--mt-bg-elevated)] transition-colors no-underline group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[15px] font-medium text-[var(--mt-text)]">{exp.name}</span>
                      <span className="text-[var(--mt-muted)] group-hover:text-[var(--mt-accent)] group-hover:translate-x-1 transition-all">&rarr;</span>
                    </div>
                    <p className="text-sm text-[var(--mt-muted)] leading-normal mb-3">{exp.description}</p>
                    <div className="flex gap-2">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[11px] px-2 py-1 bg-[var(--mt-tag-bg)] text-[var(--mt-tag-text)] border border-[var(--mt-border)]">{tag}</span>
                      ))}
                    </div>
                  </a>
                )}
              </Projects.List>
            </div>
          ) : (
            <p className="font-mono text-sm text-[var(--mt-muted)] p-6 border border-dashed border-[var(--mt-border)] text-center">Nothing here yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="flex gap-6 mb-12 max-md:flex-col max-md:gap-4">
        <SectionMarker n="04" />
        <div className="flex-1">
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--mt-muted)] mb-5">Writing</h2>
          {Blog.useAll().length > 0 ? (
            <>
              <div className="flex flex-col border-t border-dashed border-[var(--mt-border)]">
                <Blog.List limit={3}>
                  {(post, i) => (
                    <a key={i} href={`/blog/${post.id}`} className="flex gap-4 items-baseline py-4 pl-2 -ml-0.5 border-l-2 border-transparent border-b border-b-[var(--mt-border)] border-dashed hover:border-l-[var(--mt-accent)] transition-colors no-underline max-md:flex-col max-md:gap-1">
                      <span className="font-mono text-xs text-[var(--mt-muted)] shrink-0 w-16 max-md:w-auto">{formatDate(post.date)}</span>
                      <span className="text-[15px] text-[var(--mt-text)] hover:text-[var(--mt-accent)] transition-colors">{post.title}</span>
                    </a>
                  )}
                </Blog.List>
              </div>
              <a href="/blog" className="inline-flex items-center gap-1 mt-4 font-mono text-[13px] text-[var(--mt-accent)] hover:gap-2 transition-all no-underline">
                <span>view all posts</span> <span>&rarr;</span>
              </a>
            </>
          ) : (
            <p className="font-mono text-sm text-[var(--mt-muted)] p-6 border border-dashed border-[var(--mt-border)] text-center">Nothing here yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="flex gap-6 mb-12 max-md:flex-col max-md:gap-4">
        <SectionMarker n="05" />
        <div className="flex-1">
          <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--mt-muted)] mb-5">Connect</h2>
          <div className="flex flex-wrap gap-3 max-md:flex-col">
            <Socials.List>
              {(social, i) => (
                <a
                  key={i}
                  href={social.url}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-[var(--mt-bg-elevated)] border border-[var(--mt-border)] text-[var(--mt-text)] font-mono text-[13px] hover:border-[var(--mt-accent)] hover:text-[var(--mt-accent)] transition-all no-underline max-md:justify-center"
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  <span dangerouslySetInnerHTML={{ __html: socialIcons[social.icon] ?? '' }} />
                  <span>{social.name}</span>
                </a>
              )}
            </Socials.List>
          </div>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-[var(--mt-border)]">
        <div className="flex items-center font-mono text-xs">
          <span className="text-[var(--mt-muted)]">{year}</span>
          <div className="flex-1 h-px bg-[var(--mt-border)] mx-4"></div>
          <span className="text-[var(--mt-muted)] inline-flex items-center">
            <span>always learning</span><span className="w-0.5 h-3.5 bg-[var(--mt-accent)] ml-0.5 animate-[mt-blink_1.2s_step-end_infinite]"></span>
          </span>
        </div>
      </footer>
    </div>
  );
};

const PageHeader = () => (
  <header className="flex justify-between items-center mb-16 pb-6 border-b border-[var(--mt-border)]">
    <a href="/" className="font-mono text-sm flex items-center gap-0.5 no-underline">
      <span className="text-[var(--mt-muted)]">~/</span>
      <span className="text-[var(--mt-text)] font-medium">reece-martin</span>
    </a>
    <nav className="flex items-center gap-6">
      <a href="/blog" className="font-mono text-sm text-[var(--mt-muted)] hover:text-[var(--mt-accent)] transition-colors">blog</a>
    </nav>
  </header>
);

const BlogIndexView = () => {
  const posts = Blog.useAll();
  return (
    <div className="max-w-[640px] mx-auto px-6 py-12 md:py-16">
      <PageHeader />
      <section className="mb-8 pb-8 border-b border-[var(--mt-border)]">
        <h1 className="font-mono text-[28px] font-semibold text-[var(--mt-text)] mb-2 tracking-tight">Blog</h1>
        <p className="text-base text-[var(--mt-muted)]">Thoughts on systems design, tooling, and things I'm learning.</p>
      </section>
      <section>
        {posts.length === 0 ? (
          <p className="font-mono text-sm text-[var(--mt-muted)] p-6 border border-dashed border-[var(--mt-border)] text-center">No posts yet.</p>
        ) : (
          <div className="flex flex-col border-t border-dashed border-[var(--mt-border)]">
            {posts.map((post) => {
              const y = post.date.getFullYear();
              const m = String(post.date.getMonth() + 1).padStart(2, '0');
              return (
                <a
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="flex gap-4 items-baseline py-4 pl-2 -ml-0.5 border-l-2 border-transparent border-b border-b-[var(--mt-border)] border-dashed hover:border-l-[var(--mt-accent)] transition-colors no-underline max-md:flex-col max-md:gap-1"
                >
                  <span className="font-mono text-xs text-[var(--mt-muted)] shrink-0 w-16 max-md:w-auto">{y}.{m}</span>
                  <span className="text-[15px] text-[var(--mt-text)] hover:text-[var(--mt-accent)] transition-colors">{post.title}</span>
                </a>
              );
            })}
          </div>
        )}
      </section>
      <footer className="mt-16 pt-8 border-t border-[var(--mt-border)]">
        <a href="/" className="text-[var(--mt-muted)] no-underline font-mono text-[13px] hover:text-[var(--mt-accent)] transition-colors">
          &larr; back home
        </a>
      </footer>
    </div>
  );
};

const BlogPostView = ({ post }: { post: BlogEntry }) => (
  <div className="max-w-[640px] mx-auto px-6 py-12 md:py-16">
    <PageHeader />
    <article>
      <header className="mb-12 pb-6 border-b border-[var(--mt-border)]">
        <h1 className="font-mono text-[28px] font-semibold text-[var(--mt-text)] mb-2 tracking-tight">{post.title}</h1>
        <time dateTime={post.date.toISOString()} className="font-mono text-[13px] text-[var(--mt-muted)]">
          {formatFullDate(post.date)}
        </time>
      </header>
      <div
        className="mt-prose pb-12 border-b border-[var(--mt-border)]"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
    <footer className="mt-16 pt-8 border-t border-[var(--mt-border)]">
      <a href="/blog" className="text-[var(--mt-muted)] no-underline font-mono text-[13px] hover:text-[var(--mt-accent)] transition-colors">
        &larr; back to blog
      </a>
    </footer>
  </div>
);

const NotFoundView = ({ title }: { title: string }) => (
  <div className="max-w-[640px] mx-auto px-6 py-12 md:py-16">
    <PageHeader />
    <p className="font-mono text-sm text-[var(--mt-muted)] p-6 border border-dashed border-[var(--mt-border)] text-center">
      {title}
    </p>
  </div>
);

const matchBlogPostPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/blog\/(.+?)\/?$/);
  return m ? m[1] : null;
};

export default function MonospaceTerminal({ content, pathname }: ThemeComponentProps) {
  const postId = matchBlogPostPath(pathname);
  const post = postId ? content.blog.find((p) => p.id === postId) : undefined;

  const view = post
    ? <BlogPostView post={post} />
    : postId
      ? <NotFoundView title="Post not found" />
      : pathname === '/blog'
        ? <BlogIndexView />
        : <Body />;

  return (
    <ContentProvider content={content}>
      {view}
      <Navigator initialSlug={initialSlug} about={content.about} />
    </ContentProvider>
  );
}

