import type { ThemeMeta } from '@/theme-runtime/types';

export const meta: ThemeMeta = {
  id: 'projects-terminal',
  date: '2026-04-12',
  name: 'Projects Terminal',
  author: { model: 'Opus 4.6', harness: 'Claude Code CLI' },
  description:
    'Interactive terminal UI with dithered pixel mesh background, inspired by Stripe projects.dev.',
  inspiration: [
    { label: 'Stripe projects.dev', url: 'https://projects.dev' },
  ],
  supportsColorSchemes: ['light', 'dark'],
  defaultColorScheme: 'dark',
  fonts: [{ family: 'geist-mono', weights: [400, 500, 600] }],
  transitions: {
    out: { keyframes: 'pt-fade-out', duration: 300, easing: 'ease-in' },
    in: {
      keyframes: 'pt-fade-in',
      duration: 400,
      easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
    },
  },
};
