import type { ThemeMeta } from '@/theme-runtime/types';

export const meta: ThemeMeta = {
  id: 'quiet-dither',
  date: '2026-05-23',
  name: 'Quiet Dither',
  author: { model: 'Opus 4.7', harness: 'Claude Code CLI' },
  description:
    'Minimalist ink-on-paper with a barely-there living dither grain, a dither-ring cursor, and pages that develop in and out of static.',
  supportsColorSchemes: ['light', 'dark'],
  defaultColorScheme: 'dark',
  transitions: {
    out: { keyframes: 'qd-out', duration: 280, easing: 'ease-in' },
    in: { keyframes: 'qd-in', duration: 360, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
  },
};
