export * from './types';
export * from './content';
export * from './prefs';
export * from './navigator';
export * from './transitions';

import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { ThemeContent } from './types';

/** Memoized across pages in the same build process so we don't re-render
 *  every markdown post for every prerendered page. */
let cached: Promise<ThemeContent> | null = null;

/** Loads the full, normalized content payload used by every theme. Blog
 *  post bodies are pre-rendered to HTML strings at build time so themes
 *  can render any post purely from content, supporting client-side
 *  navigation to posts without a full reload. */
export const loadThemeContent = async (): Promise<ThemeContent> => {
  if (cached) return cached;
  cached = (async () => {
    const [profileEntries, experienceEntries, experimentEntries, socialEntries, blogEntries, siteEntries] =
      await Promise.all([
        getCollection('profile'),
        getCollection('experience'),
        getCollection('experiments'),
        getCollection('socials'),
        getCollection('blog'),
        getCollection('site'),
      ]);

    const reece = profileEntries.find((e) => e.id === 'reece');
    if (!reece) throw new Error('Missing profile/reece.json');

    const about = siteEntries.find((e) => e.id === 'about');
    if (!about) throw new Error('Missing site/about.json');

    const container = await AstroContainer.create();
    const blog = await Promise.all(
      blogEntries.map(async (e) => {
        const { Content } = await render(e);
        const body = await container.renderToString(Content);
        return {
          id: e.id,
          title: e.data.title,
          date: e.data.date,
          description: e.data.description,
          body,
        };
      }),
    );

    return {
      profile: reece.data,
      experience: experienceEntries.map((e) => e.data).sort((a, b) => a.order - b.order),
      experiments: experimentEntries.map((e) => e.data).sort((a, b) => a.order - b.order),
      socials: socialEntries.map((e) => e.data).sort((a, b) => a.order - b.order),
      blog: blog.sort((a, b) => b.date.getTime() - a.date.getTime()),
      about: about.data,
    };
  })();
  return cached;
};
