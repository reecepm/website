import { useEffect, useState } from 'react';
import type { ColorScheme } from './types';

const STORAGE_KEY = 'theme-color-scheme';

const readStored = (): ColorScheme | null => {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
};

const applyToDocument = (scheme: ColorScheme) => {
  document.documentElement.setAttribute('data-theme', scheme);
};

export const useColorScheme = (fallback: ColorScheme = 'light') => {
  const [scheme, setSchemeState] = useState<ColorScheme>(fallback);

  useEffect(() => {
    const stored = readStored() ?? fallback;
    setSchemeState(stored);
    applyToDocument(stored);
  }, [fallback]);

  const setScheme = (next: ColorScheme) => {
    setSchemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyToDocument(next);
  };

  return [scheme, setScheme] as const;
};

/** Inline script string to pre-paint the `data-theme` attribute on <html>
 *  from the persisted color scheme before first paint. */
export const colorSchemeBootScript = `
  (function () {
    try {
      var v = localStorage.getItem('${STORAGE_KEY}');
      if (v !== 'light' && v !== 'dark') v = 'light';
      document.documentElement.setAttribute('data-theme', v);
    } catch (e) {}
  })();
`;
