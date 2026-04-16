import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Fragment shader inspired by Stripe's projects.dev pipeline:
// 1. Smooth flowing color field (simulating their 3D wave + palette texture)
// 2. Post-process ordered dithering using their exact Bayer 4x4 approach
const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDpr;

// Stripe's exact 4x4 Bayer matrix threshold (WebGL1-safe: no dynamic index), thanks guys
float bayer4Threshold(vec2 fragCoord) {
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
}

vec3 warmPalette(float t) {
  t = fract(t);
  vec3 orange  = vec3(0.92, 0.52, 0.18);
  vec3 yellow  = vec3(0.93, 0.78, 0.28);
  vec3 coral   = vec3(0.9, 0.42, 0.35);
  vec3 pink    = vec3(0.88, 0.38, 0.55);
  vec3 magenta = vec3(0.76, 0.3, 0.55);
  vec3 purple  = vec3(0.48, 0.35, 0.78);

  vec3 c = orange;
  c = mix(c, yellow,  smoothstep(0.0,  0.2, t));
  c = mix(c, coral,   smoothstep(0.2,  0.38, t));
  c = mix(c, pink,    smoothstep(0.38, 0.55, t));
  c = mix(c, magenta, smoothstep(0.55, 0.7, t));
  c = mix(c, purple,  smoothstep(0.7,  0.88, t));
  c = mix(c, orange,  smoothstep(0.88, 1.0, t));
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = uTime;

  // Mouse — subtle UV warp near cursor
  vec2 mouseUV = uMouse / uResolution;
  vec2 puv = uv + (uv - mouseUV) * smoothstep(0.25, 0.0, distance(uv, mouseUV)) * 0.03;

  // Flowing palette parameter — sine waves create organic movement
  // Multiple overlapping waves at different speeds and scales
  float p = puv.x * 0.35 + puv.y * 0.2;
  p += sin(puv.x * 2.0 + puv.y * 1.5 + t * 0.15) * 0.15;
  p += cos(puv.x * 1.3 - puv.y * 2.2 + t * 0.12 + 1.0) * 0.13;
  p += sin(puv.x * 3.2 + puv.y * 0.6 + t * 0.18 + 2.5) * 0.08;
  p += cos(puv.x * 0.8 + puv.y * 3.0 + t * 0.14 + 4.0) * 0.09;
  p += sin(puv.x * 2.5 - puv.y * 1.6 + t * 0.22 + 1.5) * 0.06;
  p += cos(puv.x * 1.8 + puv.y * 2.4 + t * 0.1 + 3.0) * 0.07;

  vec3 color = warmPalette(p);

  // Ordered dithering: Bayer4, scale controls dot size,
  // levels controls quantization coarseness
  // Dither in CSS-pixel space (divide by DPR) so dots are consistent across screens
  float ditherScale = 2.0;
  float threshold = bayer4Threshold(gl_FragCoord.xy / (ditherScale * uDpr));
  float levels = 5.0;
  vec3 dithered = floor(color * levels + threshold) / levels;

  gl_FragColor = vec4(clamp(dithered, 0.0, 1.0), 1.0);
}`;

export default function DitheredBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uRes = gl.getUniformLocation(prog, 'uResolution');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uDpr = gl.getUniformLocation(prog, 'uDpr');

    let raf: number;
    let lastW = 0;
    let lastH = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const w = Math.round(cw * dpr);
      const h = Math.round(ch * dpr);
      if (w !== lastW || h !== lastH) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        lastW = w;
        lastH = h;
      }

      gl.uniform1f(uTime, (Date.now() % 10000000) / 1000);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, mouseRef.current.x * dpr, h - mouseRef.current.y * dpr);
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen"
      style={{ zIndex: 0, pointerEvents: 'none', animation: 'pt-bg-in 600ms ease-out' }}
    />
  );
}
