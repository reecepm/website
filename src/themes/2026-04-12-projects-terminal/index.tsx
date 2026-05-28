import { useCallback, useRef, useState } from 'react';
import { ContentProvider, ProseHtml } from '@/theme-runtime/content';
import { useColorScheme } from '@/theme-runtime/prefs';
import type { ThemeComponentProps } from '@/themes/manifest';
import type { BlogEntry, ExperimentEntry } from '@/theme-runtime/types';
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

type OpenExperiment = {
  experiment: ExperimentEntry;
  z: number;
  bounds: { x: number; y: number; width: number; height: number };
};

const makeBounds = (count: number) => {
  const offset = count * 30;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(vw * 0.55, 750);
  const h = Math.min(vh * 0.6, 650);
  return {
    x: Math.round((vw - w) / 2) + offset,
    y: Math.round((vh - h) / 2) + offset - 20,
    width: w,
    height: h,
  };
};

export default function ProjectsTerminal({ content, pathname }: ThemeComponentProps) {
  const [colorScheme, setColorScheme] = useColorScheme(meta.defaultColorScheme ?? 'dark');
  const [openPosts, setOpenPosts] = useState<OpenPost[]>([]);
  const [openExperiments, setOpenExperiments] = useState<OpenExperiment[]>([]);
  const nextZRef = useRef(20);
  const lastNavRef = useRef<string | null>(null);
  const openPostsRef = useRef<OpenPost[]>([]);
  const openExperimentsRef = useRef<OpenExperiment[]>([]);
  openPostsRef.current = openPosts;
  openExperimentsRef.current = openExperiments;

  // Window URL changes flow through here so ThemeRoot's pathname stays in sync (it listens for popstate); Terminal skips these via lastNavRef.
  const syncUrl = useCallback((path: string) => {
    lastNavRef.current = path;
    window.history.replaceState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const toggleTheme = useCallback(() => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setColorScheme]);

  const openBlogPost = useCallback(
    (post: BlogEntry) => {
      setOpenPosts((prev) => {
        if (prev.some((p) => p.post.id === post.id)) {
          return prev.map((p) => (p.post.id === post.id ? { ...p, z: nextZRef.current++ } : p));
        }
        return [...prev, { post, z: nextZRef.current++, bounds: makeBounds(prev.length) }];
      });
      syncUrl(`/blog/${post.id}`);
    },
    [syncUrl],
  );

  const closeBlogPost = useCallback(
    (id: string) => {
      const remaining = openPostsRef.current.filter((p) => p.post.id !== id);
      setOpenPosts(remaining);
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (currentPath === `/blog/${id}`) {
        const topmost = remaining.length ? remaining.reduce((a, b) => (a.z > b.z ? a : b)) : null;
        syncUrl(topmost ? `/blog/${topmost.post.id}` : '/');
      }
    },
    [syncUrl],
  );

  const focusBlogPost = useCallback(
    (id: string) => {
      setOpenPosts((prev) => prev.map((p) => (p.post.id === id ? { ...p, z: nextZRef.current++ } : p)));
      syncUrl(`/blog/${id}`);
    },
    [syncUrl],
  );

  const openExperiment = useCallback(
    (experiment: ExperimentEntry) => {
      setOpenExperiments((prev) => {
        if (prev.some((e) => e.experiment.id === experiment.id)) {
          return prev.map((e) =>
            e.experiment.id === experiment.id ? { ...e, z: nextZRef.current++ } : e,
          );
        }
        return [...prev, { experiment, z: nextZRef.current++, bounds: makeBounds(prev.length) }];
      });
      syncUrl(`/experiments/${experiment.id}`);
    },
    [syncUrl],
  );

  const closeExperiment = useCallback(
    (id: string) => {
      const remaining = openExperimentsRef.current.filter((e) => e.experiment.id !== id);
      setOpenExperiments(remaining);
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (currentPath === `/experiments/${id}`) {
        const topmost = remaining.length ? remaining.reduce((a, b) => (a.z > b.z ? a : b)) : null;
        syncUrl(topmost ? `/experiments/${topmost.experiment.id}` : '/');
      }
    },
    [syncUrl],
  );

  const focusExperiment = useCallback(
    (id: string) => {
      setOpenExperiments((prev) =>
        prev.map((e) => (e.experiment.id === id ? { ...e, z: nextZRef.current++ } : e)),
      );
      syncUrl(`/experiments/${id}`);
    },
    [syncUrl],
  );

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
          onOpenExperiment={openExperiment}
          navRef={lastNavRef}
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
            <ProseHtml className="pt-prose" html={entry.post.body} />
          </div>
        </TerminalWindow>
      ))}

      {openExperiments.map((entry) => (
        <TerminalWindow
          key={entry.experiment.id}
          title={entry.experiment.title}
          onClose={() => closeExperiment(entry.experiment.id)}
          initialBounds={entry.bounds}
          zIndex={entry.z}
          onFocus={() => focusExperiment(entry.experiment.id)}
        >
          <div className="h-full overflow-y-auto px-5 py-4 pt-scroll">
            <div className="text-[var(--pt-accent)] text-lg font-semibold mb-1">
              {entry.experiment.title}
            </div>
            <div className="text-[var(--pt-muted)] text-xs mb-2">
              <span className="text-[var(--pt-text-dim)]">Published</span>{' '}
              {entry.experiment.date.toISOString().slice(0, 10)}
              {entry.experiment.period && (
                <>
                  {'  ·  '}
                  <span className="text-[var(--pt-text-dim)]">Experiment period</span>{' '}
                  {entry.experiment.period}
                </>
              )}
            </div>
            {entry.experiment.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {entry.experiment.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--pt-border)] text-[var(--pt-text-dim)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {entry.experiment.github && (
              <a
                href={entry.experiment.github}
                target="_blank"
                rel="noopener"
                data-theme-external=""
                className="inline-block mb-4 text-sm text-[var(--pt-link)] hover:underline"
              >
                GitHub →
              </a>
            )}
            <ProseHtml className="pt-prose" html={entry.experiment.body} />
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
