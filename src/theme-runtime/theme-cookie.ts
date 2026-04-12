/**
 * Client-side theme persistence. Uses document.cookie so we could move to
 * server-read later if we ever switch to SSR, but for now it's pure client.
 */

export const THEME_COOKIE = 'theme';
const MAX_AGE_SECONDS = 60 * 60 * 24; // 24h — new themes become default next day

export const readStoredTheme = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const writeStoredTheme = (slug: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${THEME_COOKIE}=${encodeURIComponent(slug)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const clearStoredTheme = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${THEME_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};
