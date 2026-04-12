import type { ComponentType } from 'react';
import type { ThemeMeta, ThemeContent } from '@/theme-runtime/types';

/** Props every theme component receives. Themes may ignore any they don't use. */
export type ThemeComponentProps = {
  content: ThemeContent;
  /** Current URL pathname. Themes switch on this to decide what to render.
   *  A theme may also ignore it and render one view for any URL. */
  pathname: string;
};

export type ThemeComponent = ComponentType<ThemeComponentProps>;

export type ThemeModule = { default: ThemeComponent };

export type ThemeEntry = {
  meta: ThemeMeta;
  slug: string;
  /** Lazy loader. Vite code-splits per dynamic import, so a new theme adds
   *  exactly one new chunk and zero cost to any other theme's bundle. */
  load: () => Promise<ThemeModule>;
};

// Auto-discover themes via Vite's glob import. Metas are eagerly loaded
// (they're tiny and we need them synchronously to build the manifest).
// The component `index.tsx` files are lazy — each becomes its own chunk.
// Dropping a new folder under src/themes/ adds it automatically.
const metaModules = import.meta.glob<{ meta: ThemeMeta }>('./*/meta.ts', { eager: true });
const componentLoaders = import.meta.glob<ThemeModule>('./*/index.tsx');

const makeSlug = (meta: ThemeMeta) => `${meta.date}-${meta.id}`;

const discovered: ThemeEntry[] = Object.entries(metaModules).map(([metaPath, mod]) => {
  const folder = metaPath.match(/^\.\/([^/]+)\/meta\.ts$/)?.[1];
  if (!folder) throw new Error(`[manifest] unexpected meta path: ${metaPath}`);
  const loader = componentLoaders[`./${folder}/index.tsx`];
  if (!loader) throw new Error(`[manifest] theme "${folder}" is missing index.tsx`);
  return {
    meta: mod.meta,
    slug: makeSlug(mod.meta),
    load: loader,
  };
});

/** Newest-first order. The first entry is the "latest" — the default shown
 *  to visitors without a stored preference. */
export const themes: ThemeEntry[] = [...discovered].sort((a, b) =>
  b.meta.date.localeCompare(a.meta.date),
);

export const getLatestTheme = (): ThemeEntry => themes[0];

export const getThemeBySlug = (slug: string): ThemeEntry | undefined =>
  themes.find((t) => t.slug === slug);

export const formatAuthor = (meta: ThemeMeta): string =>
  `${meta.author.model} / ${meta.author.harness}`;

export const formatDisplayDate = (isoDate: string): string => isoDate.replace(/-/g, '.');
