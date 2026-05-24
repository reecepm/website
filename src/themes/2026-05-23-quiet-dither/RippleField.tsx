import { useEffect, useRef } from 'react';
import type { QdColors } from './palette';
import { drawDither } from './bayer';

// Small, quick dither ring on click; dragging lays down a trail of them.
// Screen-blends on dark, multiply on light, so rings read over the page without
// obscuring text. Disabled under prefers-reduced-motion.

export default function RippleField({ colors }: { colors: QdColors }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.style.mixBlendMode = colors.scheme === 'dark' ? 'screen' : 'multiply';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const LIFE = 440;
    const SPEED = 260; // max radius ~115px
    const TH = 10;
    const cell = 3;
    const ripples: { x: number; y: number; t: number }[] = [];

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastSpawn = 0;

    const spawn = (x: number, y: number) => {
      ripples.push({ x, y, t: performance.now() });
      if (ripples.length > 24) ripples.shift();
      lastX = x;
      lastY = y;
      lastSpawn = performance.now();
    };

    const onDown = (e: MouseEvent) => {
      dragging = true;
      spawn(e.clientX, e.clientY);
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const now = performance.now();
      if (now - lastSpawn > 55 && Math.hypot(e.clientX - lastX, e.clientY - lastY) > 22) {
        spawn(e.clientX, e.clientY);
      }
    };
    const onUp = () => {
      dragging = false;
    };

    let raf = 0;
    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const now = performance.now();
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = now - rp.t;
        if (age > LIFE) {
          ripples.splice(i, 1);
          continue;
        }
        const k = 1 - age / LIFE;
        const rad = (age / 1000) * SPEED;
        const ext = rad + TH;
        ctx.save();
        ctx.translate(rp.x - ext, rp.y - ext);
        drawDither(ctx, {
          width: ext * 2,
          height: ext * 2,
          cell,
          color: colors.accentRgb,
          alpha: k * 0.8,
          clear: false,
          intensity: (cx, cy) => {
            const d = Math.hypot(cx - ext, cy - ext);
            return 1 - Math.abs(d - rad) / TH;
          },
        });
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [colors]);

  return <canvas ref={ref} className="qd-ripple" aria-hidden="true" />;
}
