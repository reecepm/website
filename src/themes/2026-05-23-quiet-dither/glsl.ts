// Minimal fullscreen-shader runner for the ambient grain. Handles the
// boilerplate (fullscreen triangle, compile/link, DPR-aware resize, rAF loop,
// auto-set uTime/uResolution/uDpr) and hands each frame back so the caller can
// set its own uniforms.

const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

export type ShaderFrame = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  time: number;
  w: number;
  h: number;
  dpr: number;
};

export type RunShaderOpts = {
  frag: string;
  onFrame?: (f: ShaderFrame) => void;
  maxDpr?: number;
};

export const runShader = (
  canvas: HTMLCanvasElement,
  { frag, onFrame, maxDpr = 2 }: RunShaderOpts,
): (() => void) => {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) return () => {};

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[quiet-dither shader]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return () => {};

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'uTime');
  const uRes = gl.getUniformLocation(program, 'uResolution');
  const uDpr = gl.getUniformLocation(program, 'uDpr');
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const start = performance.now();

  let raf = 0;
  let lastW = 0;
  let lastH = 0;

  const render = () => {
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w !== lastW || h !== lastH) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      lastW = w;
      lastH = h;
    }
    const time = (performance.now() - start) / 1000;
    if (uTime) gl.uniform1f(uTime, time);
    if (uRes) gl.uniform2f(uRes, w, h);
    if (uDpr) gl.uniform1f(uDpr, dpr);
    onFrame?.({ gl, program, time, w, h, dpr });
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(render);
  };
  gl.clearColor(0, 0, 0, 0);
  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
};

export const FRAG_HEADER = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform float uDpr;
`;
