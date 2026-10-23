// GLSL shaders (as strings so no loader config is needed).

const noise = /* glsl */ `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
`;

/* ---------- Full-screen background: domain-warped fbm that reacts to mouse, scroll velocity and page progress ---------- */
export const bgVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const bgFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime; uniform float uVel; uniform float uProgress;
uniform vec2 uRes; uniform vec2 uMouse;
${noise}
void main(){
  vec2 uv = vUv;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  float t = uTime * 0.045;

  // the cursor gently bends the field around it, scroll velocity amplifies it
  float md = length(p - m);
  p += (p - m) * 0.15 / (md * 3.0 + 1.0) * (0.2 + abs(uVel));

  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.8 + q * 2.2 + vec2(1.7, 9.2) + t * 1.6), fbm(p * 1.8 + q * 2.2 + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.6 + r * 2.0 + uProgress * 3.0);

  // palette drifts teal -> violet -> orange as you scroll down the page
  vec3 hi = mix(vec3(0.18, 0.72, 0.77), vec3(0.55, 0.35, 0.95), smoothstep(0.2, 0.6, uProgress));
  hi = mix(hi, vec3(1.0, 0.48, 0.24), smoothstep(0.65, 1.0, uProgress));

  vec3 base = vec3(0.020, 0.027, 0.050);
  vec3 col = mix(base, base * 3.2 + vec3(0.0, 0.03, 0.05), smoothstep(0.2, 0.75, f));
  col += hi * pow(smoothstep(0.45, 0.95, f * r.x * 2.0), 2.2) * 0.42;
  col += hi * smoothstep(0.6, 0.0, md) * 0.10 * (1.0 + abs(uVel) * 2.0);
  col *= smoothstep(1.35, 0.25, length(uv - 0.5) * 1.5) * 0.5 + 0.5;
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ---------- Image / procedural plane synced to a DOM element ---------- */
export const planeVert = /* glsl */ `
varying vec2 vUv;
uniform float uVel;
void main(){
  vUv = uv;
  vec3 p = position;
  // the plane bends and skews with scroll velocity
  p.y -= sin(uv.x * 3.14159) * uVel * 0.05;
  p.x += (uv.y - 0.5) * uVel * 0.03;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const planeFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uHasTex; uniform float uTime; uniform float uHover; uniform float uReveal; uniform float uVel; uniform float uSeed;
uniform vec2 uMouse; uniform vec2 uPlane; uniform vec2 uImage;
uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
${noise}
vec2 cover(vec2 uv, vec2 plane, vec2 img){
  vec2 ratio = vec2(min((plane.x / plane.y) / (img.x / img.y), 1.0), min((plane.y / plane.x) / (img.y / img.x), 1.0));
  return vec2(uv.x * ratio.x + (1.0 - ratio.x) * 0.5, uv.y * ratio.y + (1.0 - ratio.y) * 0.5);
}
void main(){
  vec2 uv = vUv;
  float asp = uPlane.x / uPlane.y;

  // ripple radiating from the cursor
  vec2 d2 = (uv - uMouse) * vec2(asp, 1.0);
  float d = length(d2);
  vec2 dir = d2 / (d + 1e-4);
  float ripple = sin(d * 26.0 - uTime * 2.4) * exp(-d * 4.2) * uHover;
  vec2 puv = uv + dir * ripple * 0.018;
  puv = (puv - 0.5) * (1.0 - (1.0 - uReveal) * 0.25) + 0.5;   // zoom-in while revealing

  vec3 col;
  float shift = 0.004 * uHover + abs(uVel) * 0.012;           // RGB split on hover + scroll
  if (uHasTex > 0.5) {
    vec2 cu = cover(puv, uPlane, uImage);
    col = vec3(texture2D(uTex, cu + dir * shift).r, texture2D(uTex, cu).g, texture2D(uTex, cu - dir * shift).b);
    float g = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(g) * vec3(0.9, 0.95, 1.0), col, 0.25 + 0.75 * uHover);   // greyscale -> colour on hover
    col *= 0.8 + 0.2 * uHover;
  } else {
    // generative cover art, unique per project (palette + seed)
    vec2 p = (puv - 0.5) * vec2(asp, 1.0) * 1.8 + uSeed * 7.3;
    float t = uTime * 0.07;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
    float f = fbm(p + 3.0 * r + dir * ripple * 0.3);
    col = mix(uC1, uC2, smoothstep(0.15, 0.7, f));
    col = mix(col, uC3, smoothstep(0.55, 0.95, f * f * 2.2 + r.x * 0.3 + uHover * 0.12));
    col *= 0.92 + 0.08 * sin(puv.y * uPlane.y * 0.9);          // fine scan lines
  }

  float vg = smoothstep(1.05, 0.35, length(uv - 0.5));
  col *= mix(0.7, 1.0, vg);
  col += (hash(uv * uPlane + uTime) - 0.5) * 0.05;

  // reveal wipe from the bottom edge upwards
  float m = uReveal * 1.1;
  float a = 1.0 - smoothstep(m - 0.1, m, uv.y);
  gl_FragColor = vec4(col, a);
}
`;
