import type { RGB } from './palette';

// Ordered-dither primitives. 8x8 Bayer for Canvas2D (ripple, develop), plus the
// WebGL1-safe 4x4 threshold function for the ambient grain shader. Lineage runs
// back to the 4.6 theme's Bayer pipeline.

export const BAYER_8: number[][] = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

export const bayer8 = (x: number, y: number) =>
  BAYER_8[((y % 8) + 8) % 8][((x % 8) + 8) % 8];

// WebGL1-safe 4x4 Bayer threshold. No dynamic indexing; branch ladder only.
export const GLSL_BAYER4 = /* glsl */ `
float bayer4(vec2 fragCoord) {
  vec2 px = mod(floor(fragCoord), 4.0);
  float x = px.x, y = px.y;
  if (y < 0.5) {
    if (x < 0.5) return 0.0/16.0;
    if (x < 1.5) return 8.0/16.0;
    if (x < 2.5) return 2.0/16.0;
    return 10.0/16.0;
  }
  if (y < 1.5) {
    if (x < 0.5) return 12.0/16.0;
    if (x < 1.5) return 4.0/16.0;
    if (x < 2.5) return 14.0/16.0;
    return 6.0/16.0;
  }
  if (y < 2.5) {
    if (x < 0.5) return 3.0/16.0;
    if (x < 1.5) return 11.0/16.0;
    if (x < 2.5) return 1.0/16.0;
    return 9.0/16.0;
  }
  if (x < 0.5) return 15.0/16.0;
  if (x < 1.5) return 7.0/16.0;
  if (x < 2.5) return 13.0/16.0;
  return 5.0/16.0;
}`;

export type DitherOpts = {
  width: number;
  height: number;
  cell: number;
  color: RGB;
  intensity: (cx: number, cy: number, col: number, row: number) => number;
  matrix?: number[][];
  alpha?: number;
  clear?: boolean;
};

// Paints a 1-bit ordered-dither field into a 2D context: each `cell`-sized
// square is filled iff its sampled intensity beats the Bayer threshold there.
export const drawDither = (ctx: CanvasRenderingContext2D, o: DitherOpts) => {
  const m = o.matrix ?? BAYER_8;
  const n = m.length;
  const cols = Math.ceil(o.width / o.cell);
  const rows = Math.ceil(o.height / o.cell);
  if (o.clear !== false) ctx.clearRect(0, 0, o.width, o.height);
  ctx.fillStyle = `rgba(${o.color[0]},${o.color[1]},${o.color[2]},${o.alpha ?? 1})`;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * o.cell + o.cell / 2;
      const cy = row * o.cell + o.cell / 2;
      const v = o.intensity(cx, cy, col, row);
      if (v <= 0) continue;
      const t = m[((row % n) + n) % n][((col % n) + n) % n];
      if (v >= t) ctx.fillRect(col * o.cell, row * o.cell, o.cell, o.cell);
    }
  }
};
