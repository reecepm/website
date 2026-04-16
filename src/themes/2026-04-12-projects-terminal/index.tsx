import { useCallback, useRef, useState } from 'react';
import { ContentProvider } from '@/theme-runtime/content';
import { useColorScheme } from '@/theme-runtime/prefs';
import type { ThemeComponentProps } from '@/themes/manifest';
import type { BlogEntry } from '@/theme-runtime/types';
import { meta } from './meta';
import Navigator from './Navigator';
import DitheredBackground from './DitheredBackground';
import TerminalWindow from './TerminalWindow';
import Terminal from './Terminal';
import './theme.css';

const initialSlug = `${meta.date}-${meta.id}`;

type OpenPost = {
  post: BlogEntry;
  z: number;
  bounds: { x: number; y: number; width: number; height: number };
};

export default function ProjectsTerminal({ content, pathname }: ThemeComponentProps) {
  const [colorScheme, setColorScheme] = useColorScheme(meta.defaultColorScheme ?? 'dark');
  const [openPosts, setOpenPosts] = useState<OpenPost[]>([]);
  const nextZRef = useRef(20);

  const toggleTheme = useCallback(() => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setColorScheme]);

  const openBlogPost = useCallback((post: BlogEntry) => {
    setOpenPosts((prev) => {
      const existing = prev.find((p) => p.post.id === post.id);
      if (existing) {
        window.history.replaceState({}, '', `/blog/${post.id}`);
        return prev.map((p) =>
          p.post.id === post.id ? { ...p, z: nextZRef.current++ } : p,
        );
      }

      const count = prev.length;
      const offset = count * 30;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(vw * 0.55, 750);
      const h = Math.min(vh * 0.6, 650);

      return [
        ...prev,
        {
          post,
          z: nextZRef.current++,
          bounds: {
            x: Math.round((vw - w) / 2) + offset,
            y: Math.round((vh - h) / 2) + offset - 20,
            width: w,
            height: h,
          },
        },
      ];
    });
  }, []);

  const closeBlogPost = useCallback((id: string) => {
    setOpenPosts((prev) => {
      const remaining = prev.filter((p) => p.post.id !== id);
      const currentPath = (window.location.pathname.replace(/\/+$/, '') || '/');
      if (currentPath === `/blog/${id}`) {
        if (remaining.length > 0) {
          const topmost = remaining.reduce((a, b) => (a.z > b.z ? a : b));
          window.history.replaceState({}, '', `/blog/${topmost.post.id}`);
        } else {
          window.history.replaceState({}, '', '/');
        }
      }
      return remaining;
    });
  }, []);

  const focusBlogPost = useCallback((id: string) => {
    setOpenPosts((prev) =>
      prev.map((p) => (p.post.id === id ? { ...p, z: nextZRef.current++ } : p)),
    );
    window.history.replaceState({}, '', `/blog/${id}`);
  }, []);

  return (
    <ContentProvider content={content}>
      <DitheredBackground />

      <TerminalWindow
        title="visitor@reece.so — zsh"
        rightSlot={
          <button
            onClick={toggleTheme}
            className="text-xs text-[var(--pt-text-dim)] hover:text-[var(--pt-accent)] transition-colors px-1"
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'dark' ? '○' : '●'}
          </button>
        }
      >
        <Terminal
          content={content}
          pathname={pathname}
          onOpenPost={openBlogPost}
          colorScheme={colorScheme}
          onToggleTheme={toggleTheme}
        />
      </TerminalWindow>

      {openPosts.map((entry) => (
        <TerminalWindow
          key={entry.post.id}
          title={entry.post.title}
          onClose={() => closeBlogPost(entry.post.id)}
          initialBounds={entry.bounds}
          zIndex={entry.z}
          onFocus={() => focusBlogPost(entry.post.id)}
        >
          <div className="h-full overflow-y-auto px-5 py-4 pt-scroll">
            <div className="text-[var(--pt-accent)] text-lg font-semibold mb-1">
              {entry.post.title}
            </div>
            <div className="text-[var(--pt-muted)] text-xs mb-4">
              {entry.post.date.toISOString().slice(0, 10)}
            </div>
            <div
              className="pt-prose"
              dangerouslySetInnerHTML={{ __html: entry.post.body }}
            />
          </div>
        </TerminalWindow>
      ))}

      <Navigator
        initialSlug={initialSlug}
        about={content.about}
        colorScheme={colorScheme}
        onToggleTheme={toggleTheme}
      />
    </ContentProvider>
  );
}
