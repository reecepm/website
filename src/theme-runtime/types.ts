export type ColorScheme = 'light' | 'dark';

export type Profile = {
  name: string;
  role: string;
  location: string;
  focus: string;
  bio: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  dateRange: string;
  description: string;
  tags: string[];
  url?: string;
  order: number;
};

export type ExperimentEntry = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  tags: string[];
  github?: string;
  period?: string;
  body: string;
  // name/url/order: back-compat for the pre-markdown themes
  name: string;
  url?: string;
  order: number;
};

export type SocialEntry = {
  name: string;
  url: string;
  icon: string;
  order: number;
};

export type BlogEntry = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  /** The rendered markdown body as HTML. Themes inject via `dangerouslySetInnerHTML`
   *  inside whatever chrome they want to wrap it in. */
  body: string;
};

export type SiteInfo = {
  title: string;
  tagline: string;
  description: string;
};

export type ThemeContent = {
  profile: Profile;
  experience: ExperienceEntry[];
  experiments: ExperimentEntry[];
  socials: SocialEntry[];
  blog: BlogEntry[];
  about: SiteInfo;
};

export type ThemeAuthor = { model: string; harness: string };

export type ThemeCredit = {
  label: string;
  url?: string;
};

/**
 * A single transition leg (out or in) declared by a theme's meta.
 *
 * `keyframes` is the name of an `@keyframes` rule that the theme must define
 * in its own CSS (e.g. `'mt-crt-off'`). Set to `'none'` to explicitly play no
 * animation (instant). Omit the whole ThemeTransitions field to fall back to
 * Astro's default view transition behaviour.
 */
export type ThemeTransition = {
  keyframes: string;
  /** Duration in milliseconds. */
  duration: number;
  /** CSS timing function. Defaults to `'ease'`. */
  easing?: string;
};

export type ThemeTransitions = {
  out?: ThemeTransition;
  in?: ThemeTransition;
};

export type ThemeMeta = {
  id: string;
  date: string;
  name: string;
  author: ThemeAuthor;
  description?: string;
  inspiration?: ThemeCredit[];
  supportsColorSchemes?: ColorScheme[];
  defaultColorScheme?: ColorScheme;
  fonts?: FontSpec[];
  transitions?: ThemeTransitions;
};

export type FontSpec =
  | { family: 'geist-sans'; weights: Array<400 | 500 | 600 | 700> }
  | { family: 'geist-mono'; weights: Array<400 | 500 | 600> };

import type { ComponentType } from 'react';

export type ThemeComponent = ComponentType<{ content: ThemeContent }>;

export type ThemeModule = {
  meta: ThemeMeta;
  default: ThemeComponent;
};
