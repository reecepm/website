---
name: new-theme
description: Scaffold a new daily theme for this personal website. Use when the user asks to "create a new theme", "add a theme", "make today's design", or any variation. Reads the existing themes to infer conventions, creates a new folder under src/themes/, and wires everything up so it auto-registers via the manifest's glob import and the virtual:latest-theme Vite plugin. No shared files need editing.
---

# Creating a new theme

Themes on this site are fully self-contained React components. The build system auto-discovers them, so **you only create files inside one new folder** — you never touch `manifest.ts`, `ThemeRoot.tsx`, any page file, or `global.css`.

## What a theme must provide

Every theme lives at `src/themes/<YYYY-MM-DD>-<slug>/` (the folder name determines nothing semantically — the `date` field in `meta.ts` is what drives ordering, but **match the folder name to the date for consistency**).

Inside the folder:

- `meta.ts` — exports a `ThemeMeta` object (id, date, name, author, description, transitions, fonts, color schemes)
- `index.tsx` — default export is a React component accepting `{ content, pathname }`, wraps children in `<ContentProvider>`, and renders the theme's own navigator
- `Navigator.tsx` — the theme's picker UI, built on top of the shared `useThemeNavigator` hook
- `theme.css` — scoped CSS vars (`html[data-theme-id="..."]`), font imports, keyframes for in/out transitions, prose rules, and anything else that's genuinely CSS-layer
- Any helper files (custom animations, canvas scripts, sub-components) as the theme's concept requires

**[reference.md](reference.md)** has full type signatures, the content/hooks/decorators the theme can consume, and annotated templates for each of the four files above. Read it before scaffolding so the new theme follows the existing patterns.

## Workflow

1. **Ask the user** (if not already specified): what's the concept, the aesthetic, the author (model name + harness), the date to stamp, and whether it should be today's "latest" or backdated.

2. **Inspect existing themes** under `src/themes/` to see naming, var prefix, structure, and any patterns worth echoing or deliberately contrasting. Read at least one existing theme end-to-end before writing your own so you don't miss subtle conventions.

3. **Pick a unique prefix** for the theme's CSS vars and class names (e.g. `mt-` for monospace-terminal, `nb-` for neon-brief). Using a prefix prevents cross-theme CSS collisions when multiple themes briefly coexist during view transitions.

4. **Create the folder** and the four files. Cross-check against [reference.md](reference.md) — every requirement in that file is non-negotiable or the theme won't render correctly.

5. **Design concern: routing.** The theme's default export receives `pathname`. It's expected to render its own view for at least `/`, `/blog`, and `/blog/[slug]`. A theme may handle them as separate layouts, as a dialog overlay on the landing, as an inline section — the theme decides. Pathname normalization is already done by `ThemeRoot` (trailing slashes stripped), so match with equality: `pathname === '/blog'`. For blog posts, match with a regex on `/^\/blog\/(.+?)\/?$/` and look up `content.blog.find((p) => p.id === id)` — the `.body` field contains pre-rendered HTML.

6. **Design concern: transitions.** The `meta.transitions` field declares `out` and `in` animations by keyframe name. Define those keyframes inside the theme's own `theme.css`. The runtime composes outgoing.out + incoming.in on every user-initiated theme swap. Intra-theme navigation (e.g. `/` → `/blog`) is always instant — your transitions only fire on actual theme changes.

7. **Build to verify.** Run `pnpm build`. A green build with the new chunk emitted means the theme is auto-registered. If `virtual:latest-theme` now resolves to your new folder (most recent date), refresh to see it become the default.

## Hard constraints

- **Tailwind first.** Use arbitrary values referencing CSS vars (`text-[var(--xx-accent)]`) for any theme-specific color. Don't accumulate CSS in `theme.css` for anything Tailwind can express. Plain CSS stays reserved for: CSS var declarations, dark-mode overrides, `@keyframes`, `@font-face`, scoped body rules, prose styles, scramble/DOM-mutation effects.
- **No cross-theme collisions.** Scope vars, classes, and keyframes under `html[data-theme-id="<your-id>"]` or prefix them with your theme's namespace.
- **Never edit** `src/themes/manifest.ts`, `src/components/ThemeRoot.tsx`, `src/components/ThemeShell.astro`, `src/pages/**`, `src/theme-runtime/**`, or the Vite plugin. The manifest auto-discovers via `import.meta.glob`; the latest-theme resolver parses dates from meta files. Changing the shell breaks every theme.
- **Respect the content contract.** Content is canonical and shared. A theme may *override* the content object before passing to `ContentProvider` (easter eggs, theme-specific additions), but it may not change the shape. See [reference.md](reference.md) for the pattern.
- **Keep intra-theme nav instant.** Themes must not inject view-transition animations for route-level navigation — only for theme-to-theme swaps via `meta.transitions`. `ThemeRoot` handles routing client-side and won't trigger view transitions for intra-theme nav.

## Smoke test before declaring done

- `pnpm build` succeeds; the new theme is a new chunk if it's not the latest, or bundled into the main chunk if it is.
- Landing page renders through the new theme when its `date` is the most recent.
- `/blog` and `/blog/[slug]` render with the new theme's chrome.
- User can switch between themes via the navigator; the declared out/in keyframes play.
- Refresh on the new theme: no transition animation; the page lands on it silently.
- The old theme's view of a blog post still renders correctly — your theme's CSS must not leak outside its `html[data-theme-id]` scope.
