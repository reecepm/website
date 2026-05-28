import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { getLatestTheme, getThemeBySlug, type ThemeComponent } from '@/themes/manifest';
import { readStoredTheme, writeStoredTheme } from '@/theme-runtime/theme-cookie';
import { playSwap } from '@/theme-runtime/transitions';
import { initCarouselSwipe } from '@/theme-runtime/carousel-swipe';
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
  // no flash, no replay of initial-swap logic. Scroll reset is left to the
  // theme: themes with a cover transition (e.g. quiet-dither) reset scroll
  // behind the cover so there's no visible jump-to-top before the animation.
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

  // Touch/pen swipe for markdown `.oc-carousel` blocks. Delegated, so it covers
  // carousels rendered after client-side navigation.
  useEffect(() => initCarouselSwipe(), []);

  // Global media lightbox. Any content image/video tagged `data-zoom` (by the
  // loader) expands on click. The actual node is moved into the overlay rather
  // than cloned, so a playing video continues instead of restarting. A
  // same-size placeholder holds its spot so the page doesn't reflow — otherwise
  // pulling a slide's media out collapses the carousel behind the overlay.
  const [zoomed, setZoomed] = useState(false);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<{ media: HTMLElement; placeholder: HTMLElement; cssText: string } | null>(null);

  const closeZoom = () => {
    const r = restoreRef.current;
    if (!r) return;
    r.media.style.cssText = r.cssText;
    r.placeholder.parentNode?.replaceChild(r.media, r.placeholder);
    restoreRef.current = null;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    setZoomed(false);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (restoreRef.current) return;
      const media = (e.target as HTMLElement | null)?.closest<HTMLElement>('img[data-zoom], video[data-zoom]');
      if (!media || !holderRef.current) return;
      e.preventDefault();
      const rect = media.getBoundingClientRect();
      const placeholder = document.createElement('div');
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.margin = getComputedStyle(media).margin;
      media.parentNode?.insertBefore(placeholder, media);
      restoreRef.current = { media, placeholder, cssText: media.style.cssText };
      media.style.cssText = '';
      holderRef.current.appendChild(media);
      // Compensate for the scrollbar so locking scroll doesn't shift the page.
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      setZoomed(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeZoom();
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Theme: ThemeComponent = DynamicTheme ?? LatestTheme;

  return (
    <>
      <Theme content={content} pathname={pathname} />
      <div
        className={`lb-overlay${zoomed ? ' open' : ''}`}
        aria-hidden={!zoomed}
        onClick={closeZoom}
      >
        <div className="lb-holder" ref={holderRef} />
      </div>
    </>
  );
}
