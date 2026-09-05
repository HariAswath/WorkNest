import React, { useEffect, useRef } from 'react';

export function PrismShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec4 tanh4(vec4 x){
  vec4 e2x = exp(clamp(2.0 * x, -20.0, 20.0));
  return (e2x - 1.0) / (e2x + 1.0);
}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float sdOctaAnisoInv(vec3 p, float invBaseHalf, float invHeight, float minAxis){
  vec3 q = vec3(abs(p.x) * invBaseHalf, abs(p.y) * invHeight, abs(p.z) * invBaseHalf);
  float m = q.x + q.y + q.z - 1.0;
  return m * minAxis * 0.5773502691896258;
}

float sdPyramidUpInv(vec3 p, float invBaseHalf, float invHeight, float minAxis){
  float oct = sdOctaAnisoInv(p, invBaseHalf, invHeight, minAxis);
  float halfSpace = -p.y;
  return max(oct, halfSpace);
}

mat3 hueRotation(float a){
  float c = cos(a), s = sin(a);
  mat3 W = mat3(
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114
  );
  mat3 U = mat3(
     0.701, -0.587, -0.114,
    -0.299,  0.413, -0.114,
    -0.300, -0.588,  0.886
  );
  mat3 V = mat3(
     0.168, -0.331,  0.500,
     0.328,  0.035, -0.500,
    -0.497,  0.296,  0.201
  );
  return W + U * c + V * s;
}

void main(){
  float H = 3.5;
  float BW = 5.5;
  float BASE_HALF = BW * 0.5;
  float SCALE = 3.6;
  float GLOW = 1.1;
  float BLOOM = 1.0;
  float NOISE = 0.25;
  float SAT = 1.4;
  float CFREQ = 1.0;
  float TS = 0.5;
  
  float centerShift = H * 0.25;
  float invBaseHalf = 1.0 / BASE_HALF;
  float invHeight = 1.0 / H;
  float minAxis = min(BASE_HALF, H);
  float pxScale = 1.0 / (u_resolution.y * 0.1 * SCALE);
  
  vec2 f = (gl_FragCoord.xy - 0.5 * u_resolution.xy) * pxScale;
  
  vec2 mouseNorm = (u_mouse / max(u_resolution, vec2(1.0)) - 0.5) * 0.8;
  float yaw = -mouseNorm.x * 0.5;
  float pitch = mouseNorm.y * 0.5;
  
  float cy = cos(yaw), sy = sin(yaw);
  float cx = cos(pitch), sx = sin(pitch);
  mat3 mouseRot = mat3(
    cy, sy * sx, sy * cx,
    0.0, cx, -sx,
    -sy, cy * sx, cy * cx
  );

  float z = 5.0;
  float d = 0.0;
  vec3 p;
  vec4 o = vec4(0.0);
  
  float t = u_time * TS;
  float c0 = cos(t + 0.0);
  float c1 = cos(t + 33.0);
  float c2 = cos(t + 11.0);
  mat2 wob = mat2(c0, c1, c2, c0);
  
  const int STEPS = 90;
  for (int i = 0; i < STEPS; i++) {
    p = vec3(f, z);
    p.xz = p.xz * wob;
    p = mouseRot * p;
    vec3 q = p;
    q.y += centerShift;
    d = 0.1 + 0.2 * abs(sdPyramidUpInv(q, invBaseHalf, invHeight, minAxis));
    z -= d;
    o += (sin((p.y + z) * CFREQ + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
  }
  
  o = tanh4(o * o * (GLOW * BLOOM) / 1e5);
  vec3 col = o.rgb;
  
  float n = rand(gl_FragCoord.xy + vec2(u_time));
  col += (n - 0.5) * NOISE;
  col = clamp(col, 0.0, 1.0);
  
  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, SAT), 0.0, 1.0);
  
  col = clamp(hueRotation(-0.15) * col, 0.0, 1.0);
  
  gl_FragColor = vec4(col, o.a);
}`;

    function createShader(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram();
    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    function render(time) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render(0);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90" style={{ display: 'block' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
