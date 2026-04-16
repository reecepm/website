import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { getLatestTheme, getThemeBySlug, type ThemeComponent } from '@/themes/manifest';
import { readStoredTheme, writeStoredTheme } from '@/theme-runtime/theme-cookie';
import { playSwap } from '@/theme-runtime/transitions';
import type { ThemeContent } from '@/theme-runtime/types';

// Static import of the latest theme resolved at build time by
// `plugins/vite-plugin-latest-theme.mjs`. The plugin scans `src/themes/*`,
// picks whichever has the most recent `date` in its meta, and rewrites this
// import to point at it. All other themes load lazily via the manifest's
// `load()` thunks. Adding a new theme = drop a folder, zero imports to touch.
import LatestTheme from 'virtual:latest-theme';

type Props = {
  content: ThemeContent;
  pathname: string;
};

const updateHtmlAttrs = (slug: string) => {
  const entry = getThemeBySlug(slug);
  if (!entry) return;
  document.documentElement.dataset.themeId = entry.meta.id;
  document.documentElement.dataset.themeSlug = entry.slug;
};

/** Normalize paths so themes can compare with `=== '/blog'` regardless of
 *  Astro's trailing-slash config. Root stays '/'; everything else gets its
 *  trailing slash stripped. */
const normalizePath = (p: string): string => {
  if (p === '/' || p === '') return '/';
  return p.replace(/\/+$/, '');
};

const isInternalLinkClick = (e: MouseEvent): HTMLAnchorElement | null => {
  if (e.defaultPrevented) return null;
  if (e.button !== 0) return null;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const target = (e.target as HTMLElement | null)?.closest('a');
  if (!target) return null;
  if (target.hasAttribute('download')) return null;
  if (target.getAttribute('target') === '_blank') return null;
  if (target.hasAttribute('data-theme-external')) return null;
  const href = target.getAttribute('href');
  if (!href) return null;
  if (!href.startsWith('/')) return null;
  if (href.startsWith('//')) return null;
  return target;
};

export default function ThemeRoot({ content, pathname: initialPathname }: Props) {
  const latest = getLatestTheme();

  const [currentSlug, setCurrentSlug] = useState(latest.slug);
  const [DynamicTheme, setDynamicTheme] = useState<ThemeComponent | null>(null);
  const [pathname, setPathname] = useState(normalizePath(initialPathname));

  const currentSlugRef = useRef(currentSlug);
  useEffect(() => {
    currentSlugRef.current = currentSlug;
  }, [currentSlug]);

  useEffect(() => {
    /** Animated swap — user-initiated theme change. Runs the declared
     *  out/in keyframes via startViewTransition. */
    const swap = async (targetSlug: string) => {
      const active = currentSlugRef.current;
      if (targetSlug === active) return;
      const entry = getThemeBySlug(targetSlug);
      if (!entry) {
        console.warn(`[ThemeRoot] unknown theme: ${targetSlug}`);
        return;
      }

      let mod;
      try {
        mod = await entry.load();
      } catch (err) {
        console.error(`[ThemeRoot] failed to load ${targetSlug}`, err);
        return;
      }

      await playSwap(active, targetSlug, () => {
        flushSync(() => {
          setCurrentSlug(targetSlug);
          setDynamicTheme(() => mod.default);
        });
        updateHtmlAttrs(targetSlug);
      });

      writeStoredTheme(targetSlug);
      window.dispatchEvent(new CustomEvent('theme:changed', { detail: { slug: targetSlug } }));
    };

    window.__themeRoot = { swap };

    // Initial-mount resolution: if the user's stored preference differs from
    // the latest that static HTML prerendered, load + commit it SILENTLY.
    // A reload should feel like a reload, not replay the swap animation.
    const unhide = () => {
      document.documentElement.style.opacity = '';
    };

    const stored = readStoredTheme();
    if (stored && stored !== latest.slug) {
      const entry = getThemeBySlug(stored);
      if (entry) {
        entry.load().then(
          (mod) => {
            flushSync(() => {
              setCurrentSlug(stored);
              setDynamicTheme(() => mod.default);
            });
            updateHtmlAttrs(stored);
            unhide();
            window.dispatchEvent(new CustomEvent('theme:changed', { detail: { slug: stored } }));
          },
          (err) => {
            console.error(`[ThemeRoot] failed to restore ${stored}`, err);
            unhide();
          },
        );
      } else {
        unhide();
      }
    } else {
      unhide();
    }

    return () => {
      if (window.__themeRoot?.swap === swap) {
        delete window.__themeRoot;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intercept internal link clicks and drive navigation entirely client-side.
  // ThemeRoot stays mounted across intra-site navigation — no theme re-mount,
  // no flash, no replay of initial-swap logic.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = isInternalLinkClick(e);
      if (!anchor) return;
      const href = anchor.getAttribute('href')!;
      e.preventDefault();
      const current = window.location.pathname + window.location.search + window.location.hash;
      if (href === current) return;
      window.history.pushState({}, '', href);
      setPathname(normalizePath(window.location.pathname));
      window.scrollTo(0, 0);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Browser back/forward.
  useEffect(() => {
    const onPop = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const Theme: ThemeComponent = DynamicTheme ?? LatestTheme;

  return <Theme content={content} pathname={pathname} />;
}
