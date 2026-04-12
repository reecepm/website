import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const VIRTUAL_ID = 'virtual:latest-theme';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const THEMES_DIR = 'src/themes';

/**
 * Resolves `virtual:latest-theme` to a static `export { default } from '...'`
 * pointing at whichever theme folder has the most recent `date` field in its
 * `meta.ts`. This is how ThemeRoot gets a statically-importable "latest" for
 * SSR/prerender without the user having to update an import when a new theme
 * is added. The regex parser is intentionally dumb — it just looks for a
 * `date: 'YYYY-MM-DD'` line, which matches the ThemeMeta convention.
 */
const findLatestTheme = () => {
  const abs = resolve(THEMES_DIR);
  const folders = readdirSync(abs, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const themes = folders.flatMap((folder) => {
    const metaPath = join(abs, folder, 'meta.ts');
    try {
      const src = readFileSync(metaPath, 'utf-8');
      const match = src.match(/date\s*:\s*['"]([^'"]+)['"]/);
      if (!match) return [];
      return [{ folder, date: match[1] }];
    } catch {
      return [];
    }
  });

  if (themes.length === 0) {
    throw new Error(
      '[vite-plugin-latest-theme] No themes with a parseable `date` field found in src/themes/',
    );
  }

  themes.sort((a, b) => b.date.localeCompare(a.date));
  return themes[0];
};

export default function latestThemePlugin() {
  return {
    name: 'vite-plugin-latest-theme',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;
      const latest = findLatestTheme();
      return `export { default } from '/${THEMES_DIR}/${latest.folder}/index';`;
    },

    // Invalidate the virtual module when any meta.ts changes, so dev mode
    // picks up "latest" changes without a manual restart.
    handleHotUpdate({ file, server }) {
      if (!file.includes('/src/themes/')) return;
      if (!file.endsWith('/meta.ts')) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}
