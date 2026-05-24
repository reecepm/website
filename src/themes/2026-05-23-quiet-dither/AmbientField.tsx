import { useEffect, useRef } from 'react';
import type { QdColors } from './palette';
import { GLSL_BAYER4 } from './bayer';
import { FRAG_HEADER, runShader } from './glsl';

// Always-on, ultra-faint flowing dither grain behind everything. Each lit speck
// pulls only ~6-7% toward ink, so you only notice the texture up close. This is
// effectively the page background.

const FRAG = `${FRAG_HEADER}
uniform vec3 uInk;
uniform vec3 uPaper;
uniform float uAmount;
${GLSL_BAYER4}
void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uResolution;
  float t = uTime * 0.05;
  float f = 0.5
    + 0.30 * sin(uv.x * 6.5 + t)
    + 0.30 * cos(uv.y * 6.5 - t * 0.8)
    + 0.20 * sin((uv.x + uv.y) * 4.5 + t * 1.2);
  f = clamp(f * 0.5 + 0.25, 0.0, 1.0);
  float thr = bayer4(fc / (2.0 * uDpr));
  float on = step(thr, f);
  vec3 col = mix(uPaper, uInk, on * uAmount);
  gl_FragColor = vec4(col, 1.0);
}`;

export default function AmbientField({ colors }: { colors: QdColors }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const { inkRgb: ink, paperRgb: paper, grain } = colors;
    return runShader(canvas, {
      frag: FRAG,
      onFrame: ({ gl, program }) => {
        gl.uniform3f(gl.getUniformLocation(program, 'uInk'), ink[0] / 255, ink[1] / 255, ink[2] / 255);
        gl.uniform3f(gl.getUniformLocation(program, 'uPaper'), paper[0] / 255, paper[1] / 255, paper[2] / 255);
        gl.uniform1f(gl.getUniformLocation(program, 'uAmount'), grain);
      },
    });
  }, [colors]);

  return <canvas ref={ref} className="qd-ambient" aria-hidden="true" />;
}
