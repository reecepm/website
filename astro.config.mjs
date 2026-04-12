import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import latestTheme from './plugins/vite-plugin-latest-theme.mjs';

export default defineConfig({
  site: 'https://reece.so',
  integrations: [react()],
  vite: {
    plugins: [latestTheme()],
  },
});
