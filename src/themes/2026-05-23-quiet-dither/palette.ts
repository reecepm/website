import type { ColorScheme } from '@/theme-runtime/types';

// Canvas/WebGL layers can't read the CSS vars, so the dither colours live here
// as rgb tuples too. Keep these in sync with the CSS vars in theme.css.
export type RGB = [number, number, number];

export type QdColors = {
  scheme: ColorScheme;
  inkRgb: RGB;
  paperRgb: RGB;
  accentRgb: RGB;
  /** How far the always-on grain pulls each lit speck toward ink. */
  grain: number;
};

const DARK: QdColors = {
  scheme: 'dark',
  inkRgb: [236, 238, 242],
  paperRgb: [10, 12, 15],
  accentRgb: [111, 158, 255],
  grain: 0.07,
};

const LIGHT: QdColors = {
  scheme: 'light',
  inkRgb: [21, 23, 28],
  paperRgb: [250, 249, 246],
  accentRgb: [47, 107, 255],
  grain: 0.06,
};

export const getColors = (scheme: ColorScheme): QdColors => (scheme === 'dark' ? DARK : LIGHT);

export const rgba = (rgb: RGB, a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
