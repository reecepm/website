# Theme reference

Full signatures, content API, and annotated file templates. Read this before scaffolding a new theme.

## File tree expected

```
src/themes/YYYY-MM-DD-your-slug/
  meta.ts        # ThemeMeta export
  index.tsx      # default export React component
  Navigator.tsx  # theme-owned picker UI (built on useThemeNavigator)
  theme.css      # scoped CSS vars, fonts, keyframes, prose
  [helpers...]   # anything else the theme needs
```

The folder name should match `date` in `meta.ts` for discoverability, but the runtime identifies themes by `${meta.date}-${meta.id}` (the slug).

## Types you'll touch

All defined in `src/theme-runtime/types.ts` and `src/themes/manifest.ts`.

```ts
type ThemeMeta = {
  id: string;                      // lowercase-hyphenated, globally unique
  date: string;                    // 'YYYY-MM-DD' — drives ordering; newest wins
  name: string;                    // display name
  author: { model: string; harness: string };  // e.g. { model: 'Opus 4.6', harness: 'Claude Code CLI' }
  description?: string;            // shown in the navigator + picker popover
  inspiration?: ThemeCredit[];     // optional credit(s)
  supportsColorSchemes?: ('light' | 'dark')[];
  defaultColorScheme?: 'light' | 'dark';
  fonts?: FontSpec[];              // informational; actual loading happens in theme.css
  transitions?: {
    out?: { keyframes: string; duration: number; easing?: string };
    in?:  { keyframes: string; duration: number; easing?: string };
  };
};

type ThemeCredit = { label: string; url?: string };

type ThemeComponentProps = {
  content: ThemeContent;
  pathname: string;  // normalized — no trailing slashes except for root '/'
};

type ThemeContent = {
  profile: { name, role, location, focus, bio };
  experience: ExperienceEntry[];
  experiments: ExperimentEntry[];
  socials: SocialEntry[];
  blog: BlogEntry[];   // each has { id, title, date, description?, body }
  about: SiteInfo;     // { title, tagline, description }
};
```

`BlogEntry.body` is the pre-rendered HTML string. Inject with `dangerouslySetInnerHTML={{ __html: post.body }}` inside whatever chrome your theme wants. All posts ship in the content payload on every page so client-side navigation to a post works without a fetch.

## Content hooks (compound components)

Imports from `@/theme-runtime/content`. These work anywhere inside your theme's `<ContentProvider>`.

```tsx
import {
  ContentProvider,
  Reece,       // .useProfile(), .Name, .Role, .Location, .Focus, .Bio
  Experience,  // .useAll(), .List
  Projects,    // .useAll(), .List
  Blog,        // .useAll(), .useRecent(n), .List
  Socials,     // .useAll(), .List
} from '@/theme-runtime/content';
```

The `.List` versions take a render-prop child: `<Projects.List>{(p, i) => <div>{p.name}</div>}</Projects.List>`.

## Navigator runtime hook

The picker UI is theme-owned, but the state and keyboard handling come from a shared hook so every theme's navigator behaves consistently.

```tsx
import { useThemeNavigator } from '@/theme-runtime/navigator';

const {
  themes,       // all themes, newest-first
  current,      // the active theme entry
  newer,        // theme after current in time, or undefined
  older,        // theme before current in time, or undefined
  expanded,     // whether the timeline list is open
  setExpanded,
  infoOpen,     // whether the about popover is open
  setInfoOpen,
  navigateTo,   // (entry) => void — writes cookie, triggers animated swap
} = useThemeNavigator({ initialSlug, keyboard: true });
```

Default keyboard bindings (set via `keyboard: true`): `[` prev, `]` next, `/` toggle timeline, `?` toggle info, `Esc` close either. Opt out by passing `keyboard: false` and wiring your own.

Your theme's `Navigator.tsx` imports this hook and builds whatever UI fits the aesthetic. See existing themes for examples — they range from bottom-fixed terminal bars to floating pills.

## Required Navigator props

Your `Navigator.tsx` receives `{ initialSlug: string; about: SiteInfo }` as props from the theme's default export. Pass `content.about` as `about` and the result of `${meta.date}-${meta.id}` as `initialSlug`.

## Default export shape

```tsx
import { ContentProvider } from '@/theme-runtime/content';
import type { ThemeComponentProps } from '@/themes/manifest';
import type { BlogEntry } from '@/theme-runtime/types';
import { meta } from './meta';
import Navigator from './Navigator';
import './theme.css';

const initialSlug = `${meta.date}-${meta.id}`;

const matchBlogPostPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/blog\/(.+?)\/?$/);
  return m ? m[1] : null;
};

export default function YourTheme({ content, pathname }: ThemeComponentProps) {
  const postId = matchBlogPostPath(pathname);
  const post = postId ? content.blog.find((p) => p.id === postId) : undefined;

  const view = post
    ? <BlogPostView post={post} />
    : postId
      ? <NotFoundView title="Post not found" />
      : pathname === '/blog'
        ? <BlogIndexView />
        : <LandingView />;

  return (
    <ContentProvider content={content}>
      {view}
      <Navigator initialSlug={initialSlug} about={content.about} />
    </ContentProvider>
  );
}
```

You can override the content before passing it to `ContentProvider` to inject easter eggs:

```tsx
const themedContent = {
  ...content,
  profile: { ...content.profile, bio: content.profile.bio + ' — pirate edition' },
  blog: [...content.blog, { id: 'hidden', title: 'X marks the spot', date: new Date(), body: '<p>arrr</p>' }],
};
return <ContentProvider content={themedContent}>...</ContentProvider>;
```

## theme.css conventions

Scope everything that's not universal under `html[data-theme-id="<your-id>"]`. Everything else lives in Tailwind arbitrary values inside JSX.

```css
/* font imports (only the fonts this theme actually uses) */
@import "@fontsource/your-font/400.css";

/* keyframes — unique names so they don't collide with other themes */
@keyframes yt-out { /* the 'out' transition */ }
@keyframes yt-in  { /* the 'in' transition */ }
@keyframes yt-pulse { /* any theme-specific effect */ }

/* scoped CSS var declarations */
html[data-theme-id="your-theme-id"] {
  --yt-bg: #...;
  --yt-text: #...;
  --yt-accent: #...;
  --yt-border: #...;
  --yt-font-sans: 'Your Sans', system-ui, sans-serif;
  --yt-font-mono: 'Your Mono', ui-monospace, monospace;

  background-color: var(--yt-bg);
  color: var(--yt-text);
  font-family: var(--yt-font-sans);
}

/* dark mode if supported */
html[data-theme-id="your-theme-id"][data-theme="dark"] {
  --yt-bg: #...;
  /* etc */
}

/* body-level rule to fix the overscroll background */
html[data-theme-id="your-theme-id"] body {
  background-color: var(--yt-bg);
  padding-bottom: 56px;  /* reserve space for the nav */
}

/* prose for the blog post body — scope under the theme */
html[data-theme-id="your-theme-id"] .yt-prose { ... }
html[data-theme-id="your-theme-id"] .yt-prose h1 { ... }
html[data-theme-id="your-theme-id"] .yt-prose p { ... }
/* etc — see existing themes */
```

**Do not** use `@utility` or `@theme` directives in `theme.css`. They only work in the Tailwind entry file, and theme.css isn't one. Use plain CSS here and Tailwind arbitrary values in JSX.

## meta.ts template

```ts
import type { ThemeMeta } from '@/theme-runtime/types';

export const meta: ThemeMeta = {
  id: 'your-theme-id',
  date: '2026-MM-DD',
  name: 'Your Theme Name',
  author: { model: 'Opus 4.6', harness: 'Claude Code CLI' },
  description: 'One-line description shown in the navigator and the list.',
  supportsColorSchemes: ['light', 'dark'],
  defaultColorScheme: 'light',
  fonts: [],
  transitions: {
    out: { keyframes: 'yt-out', duration: 380, easing: 'ease-in' },
    in:  { keyframes: 'yt-in',  duration: 420, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
  },
};
```

## How theme discovery works (for debugging)

- **Manifest:** `src/themes/manifest.ts` uses `import.meta.glob('./*/meta.ts', { eager: true })` for metadata and `import.meta.glob('./*/index.tsx')` for lazy component loaders. Any folder with a `meta.ts` and an `index.tsx` auto-registers.
- **Latest resolution:** `plugins/vite-plugin-latest-theme.mjs` scans `src/themes/*/meta.ts`, parses `date` via regex, picks the newest, and resolves `virtual:latest-theme` to that theme's `index.tsx`. `ThemeRoot` imports from `virtual:latest-theme` for SSR/prerender.
- **On user swap:** the navigator calls `window.__themeRoot.swap(slug)`, which dynamically imports via the manifest's loader, runs `playSwap(out, in, commitFn)` which composes the transition CSS and wraps `document.startViewTransition` around a `flushSync` React commit.
- **On initial mount with a stored preference:** the swap is silent — no animation — so reloads feel instant.
- **On internal link clicks:** `ThemeRoot` intercepts and does `pushState` + a pathname state update. ThemeRoot stays mounted; the active theme re-renders with the new pathname. No flash, no re-run of mount-time swap logic.

## Gotchas

- **The `mt-*` prefix collision.** The monospace theme's custom classes use an `mt-*` prefix. Tailwind's `mt-4` etc. are margin-top utilities. They don't actually collide (Tailwind only emits recognized scales), but pick a different prefix for clarity.
- **Keyframes must be top-level.** Define `@keyframes` outside any selector. They're globally visible but only fire when referenced.
- **`::view-transition-*` pseudos are global.** You don't scope them via `html[data-theme-id]`. The transition runtime handles per-swap composition — don't declare `::view-transition-*` rules in your theme CSS.
- **Body padding-bottom.** Every theme's `body` rule should reserve space for the navigator. Match the navigator's actual height.
- **Pathname normalization.** `ThemeRoot` strips trailing slashes. Compare with `pathname === '/blog'`, not `=== '/blog/'`.
