import type { ThemeMeta } from '@/theme-runtime/types';

export const meta: ThemeMeta = {
  id: 'monospace-terminal',
  date: '2026-01-01',
  name: 'Monospace Terminal',
  author: { model: 'Opus 4.5', harness: 'Claude Code CLI' },
  description: 'A simple sharp theme, with small hints of terminal inspiration',
  supportsColorSchemes: ['light', 'dark'],
  defaultColorScheme: 'light',
  fonts: [
    { family: 'geist-sans', weights: [400, 500, 600, 700] },
    { family: 'geist-mono', weights: [400, 500, 600] },
  ],
  transitions: {
    out: { keyframes: 'mt-crt-off', duration: 380, easing: 'cubic-bezier(0.6, 0, 0.8, 0.2)' },
    in: { keyframes: 'mt-crt-on', duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' },
  },
};
