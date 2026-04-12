import { useCallback, useEffect, useState } from 'react';
import { themes, type ThemeEntry } from '@/themes/manifest';
import { writeStoredTheme } from './theme-cookie';

export type NavigatorState = {
  themes: ThemeEntry[];
  current: ThemeEntry;
  newer: ThemeEntry | undefined;
  older: ThemeEntry | undefined;
  currentIndex: number;
  expanded: boolean;
  setExpanded: (value: boolean | ((prev: boolean) => boolean)) => void;
  infoOpen: boolean;
  setInfoOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  navigateTo: (entry: ThemeEntry | undefined) => void;
};

export type NavigatorOptions = {
  initialSlug: string;
  /** Bind default shortcuts: `[` prev, `]` next, `/` list, `?` info, `Esc` close. */
  keyboard?: boolean;
};

declare global {
  interface Window {
    __themeRoot?: { swap: (slug: string) => void };
  }
}

/**
 * Headless state + navigation hook. Each theme renders its own navigator UI
 * on top of this hook — the hook handles state, keyboard, persistence, and
 * dispatching swaps through the global ThemeRoot.
 */
export const useThemeNavigator = ({ initialSlug, keyboard = true }: NavigatorOptions): NavigatorState => {
  const [slug, setSlug] = useState(initialSlug);
  const [expanded, setExpanded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // ThemeRoot fires this when it finishes swapping to a new theme.
  useEffect(() => {
    const onChanged = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string }>).detail;
      if (detail?.slug) setSlug(detail.slug);
    };
    window.addEventListener('theme:changed', onChanged);
    return () => window.removeEventListener('theme:changed', onChanged);
  }, []);

  const currentIndex = Math.max(0, themes.findIndex((t) => t.slug === slug));
  const current = themes[currentIndex] ?? themes[0];
  const newer = themes[currentIndex - 1];
  const older = themes[currentIndex + 1];

  const navigateTo = useCallback(
    (entry: ThemeEntry | undefined) => {
      if (!entry || entry.slug === current.slug) return;
      writeStoredTheme(entry.slug);
      window.__themeRoot?.swap(entry.slug);
    },
    [current.slug],
  );

  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
      if (e.key === '[') { e.preventDefault(); navigateTo(older); }
      else if (e.key === ']') { e.preventDefault(); navigateTo(newer); }
      else if (e.key === '/') { e.preventDefault(); setExpanded((v) => !v); setInfoOpen(false); }
      else if (e.key === '?') { e.preventDefault(); setInfoOpen((v) => !v); setExpanded(false); }
      else if (e.key === 'Escape') { setExpanded(false); setInfoOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keyboard, older, newer, navigateTo]);

  return {
    themes,
    current,
    newer,
    older,
    currentIndex,
    expanded,
    setExpanded,
    infoOpen,
    setInfoOpen,
    navigateTo,
  };
};
