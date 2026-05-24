import { useEffect, useRef } from 'react';
import { type QdColors, rgba } from './palette';
import { bayer8 } from './bayer';

// The page-transition layer (top of the stack). On mount it develops the page
// out of dither static (in). When `trigger` increments it runs the full
// out -> in cycle: dissolve the page into static, fire `onCovered` at the peak
// (so the caller swaps the route content while it's hidden), then develop the
// new page back out. Honors prefers-reduced-motion.

const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);
const easeIn = (x: number) => x * x * x * x;

type Phase = { kind: 'reveal' | 'cover'; from: number; to: number; dur: number; ease: (x: number) => number };
const REVEAL: Phase = { kind: 'reveal', from: 0, to: 1, dur: 1300, ease: easeOut };
const COVER: Phase = { kind: 'cover', from: 1, to: 0, dur: 520, ease: easeIn };

// p: 1 = clean, 0 = fully covered (dither over a paper scrim)
function paint(ctx: CanvasRenderingContext2D, colors: QdColors, w: number, h: number, p: number) {
  const cell = 4;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = rgba(colors.paperRgb, 1 - p);
  ctx.fillRect(0, 0, w, h);
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  for (let row = 0; row < rows; row++) {
    const rowNorm = (row * cell) / h;
    for (let col = 0; col < cols; col++) {
      // normalized to [0,1) so p=1 always leaves a fully clean page
      const reveal = (rowNorm * 0.5 + bayer8(col, row) * 0.6) / 1.1;
      if (p < reveal) {
        const a = Math.max(0, Math.min(1, (reveal - p) / 0.14));
        ctx.fillStyle = rgba(colors.inkRgb, a);
        ctx.fillRect(col * cell, row * cell, cell, cell);
      }
    }
  }
}

type Props = {
  colors: QdColors;
  /** 0 = initial develop-in; each increment plays a full out -> in cycle. */
  trigger: number;
  /** Fired when the cover phase peaks, the moment to swap route content. */
  onCovered?: () => void;
};

export default function DevelopTransition({ colors, trigger, onCovered }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  // Paint from a ref so a light/dark toggle (which changes `colors`) updates the
  // colours without re-running the animation effect. The transition only fires
  // on mount and on `trigger` (route) changes — never on a colour-scheme swap.
  const colorsRef = useRef(colors);
  colorsRef.current = colors;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // No animation: swap immediately and leave the page clean.
      if (trigger > 0) onCovered?.();
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(ctx, colorsRef.current, w, h, 1);
      return;
    }

    const queue: Phase[] = trigger === 0 ? [REVEAL] : [COVER, REVEAL];
    let phase = queue.shift();
    let phaseStart = performance.now();
    let raf = 0;

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!phase) {
        paint(ctx, colorsRef.current, w, h, 1); // settled clean, stop the loop
        return;
      }
      const u = Math.min((performance.now() - phaseStart) / phase.dur, 1);
      const pVal = phase.from + (phase.to - phase.from) * phase.ease(u);
      paint(ctx, colorsRef.current, w, h, pVal);

      if (u >= 1) {
        if (phase.kind === 'cover') onCovered?.();
        phase = queue.shift();
        phaseStart = performance.now();
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [trigger, onCovered]);

  return <canvas ref={ref} className="qd-develop" aria-hidden="true" />;
}
