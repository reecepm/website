import { themes } from '@/themes/manifest';
import type { ThemeTransition } from './types';

const STYLE_ID = '__theme-transition-style';
const MAX_TOTAL_DURATION = 800;

const formatAnimation = (t: ThemeTransition): string => {
  if (!t.keyframes || t.keyframes === 'none' || t.duration <= 0) return 'none';
  const easing = t.easing ?? 'ease';
  return `${t.keyframes} ${t.duration}ms ${easing} forwards`;
};

const removeExistingStyle = () => {
  const el = document.getElementById(STYLE_ID);
  if (el) el.remove();
};

const injectStyle = (cssText: string) => {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
};

/** Compose the view-transition CSS for a swap. Same-theme returns the
 *  instant-override rules; different-theme composes the outgoing theme's
 *  `out` with the incoming theme's `in`, scaled to the duration cap. */
const composeTransitionCss = (outSlug: string, inSlug: string): string => {
  if (outSlug === inSlug) {
    return [
      '::view-transition-old(root) { animation: none; }',
      '::view-transition-new(root) { animation: none; }',
    ].join('\n');
  }

  const outMeta = themes.find((t) => t.slug === outSlug)?.meta;
  const inMeta = themes.find((t) => t.slug === inSlug)?.meta;
  const out = outMeta?.transitions?.out;
  const incoming = inMeta?.transitions?.in;
  if (!out && !incoming) return '';

  const outDur = out?.duration ?? 0;
  const inDur = incoming?.duration ?? 0;
  const total = outDur + inDur;
  const scale = total > MAX_TOTAL_DURATION ? MAX_TOTAL_DURATION / total : 1;

  const scaledOut = out ? { ...out, duration: Math.round(out.duration * scale) } : undefined;
  const scaledIn = incoming ? { ...incoming, duration: Math.round(incoming.duration * scale) } : undefined;

  const rules: string[] = [];
  if (scaledOut)
    rules.push(`::view-transition-old(root) { animation: ${formatAnimation(scaledOut)}; }`);
  if (scaledIn)
    rules.push(`::view-transition-new(root) { animation: ${formatAnimation(scaledIn)}; }`);
  return rules.join('\n');
};

/**
 * Animate a theme swap using the browser's View Transitions API. `commit`
 * runs synchronously inside the transition — call `flushSync` inside it to
 * force React to commit the new tree before the browser captures the "new"
 * snapshot.
 *
 * Falls back to immediate commit if View Transitions aren't supported.
 */
export const playSwap = async (
  outSlug: string,
  inSlug: string,
  commit: () => void,
): Promise<void> => {
  removeExistingStyle();

  const css = composeTransitionCss(outSlug, inSlug);
  if (css) injectStyle(css);

  const startViewTransition = (document as unknown as {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  }).startViewTransition;

  if (typeof startViewTransition !== 'function') {
    commit();
    return;
  }

  const transition = startViewTransition.call(document, commit);
  try {
    await transition.finished;
  } catch {
    /* transition skipped or interrupted — ignore */
  }
};
