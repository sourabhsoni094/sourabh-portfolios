import * as THREE from 'three';
import { bgVert, bgFrag } from './shaders';

/**
 * One fixed full-screen canvas for the whole site:
 *  - a shader background (render order -10)
 *  - any number of Media planes tracking DOM elements
 * Driven by gsap.ticker so it shares one clock with Lenis / ScrollTrigger.
 */
export class Stage {
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas;
    this.reduced = reduced;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x05070d, 1);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    this.geometry = new THREE.PlaneGeometry(1, 1, 24, 24); // shared by all media planes
    this.medias = new Set();

    this.size = { w: window.innerWidth, h: window.innerHeight };
    this.mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    this.vel = 0;
    this.lastY = window.scrollY;
    this.progress = 0;
    this.started = false;

    // FPS guardrail state
    this.quality = 1; this.frames = 0; this.acc = 0; this.warm = true;

    this.bgUniforms = {
      uTime: { value: 0 }, uVel: { value: 0 }, uProgress: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    this.bgMaterial = new THREE.ShaderMaterial({ vertexShader: bgVert, fragmentShader: bgFrag, uniforms: this.bgUniforms, depthTest: false, depthWrite: false });
    this.bgGeometry = new THREE.PlaneGeometry(2, 2);
    this.bg = new THREE.Mesh(this.bgGeometry, this.bgMaterial);
    this.bg.renderOrder = -10;
    this.bg.frustumCulled = false;
    this.scene.add(this.bg);

    this._move = (e) => { this.mouse.tx = e.clientX / this.size.w; this.mouse.ty = 1 - e.clientY / this.size.h; };
    let t;
    this._resize = () => { clearTimeout(t); t = setTimeout(() => this.resize(), 120); };
    window.addEventListener('pointermove', this._move, { passive: true });
    window.addEventListener('resize', this._resize);
    window.addEventListener('orientationchange', this._resize);
    this.resize();
  }

  applyPixelRatio() {
    // cap at 1.5 for the heavy background shader, then scale down further if the FPS guard asks
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5) * this.quality);
    this.renderer.setSize(this.size.w, this.size.h, false);
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.size = { w, h };
    this.applyPixelRatio();
    Object.assign(this.camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
    this.camera.updateProjectionMatrix();
    this.bgUniforms.uRes.value.set(w, h);
  }

  update(time, deltaMs) {
    if (document.hidden) return;
    const y = window.scrollY;
    const v = this.reduced ? 0 : THREE.MathUtils.clamp((y - this.lastY) / 60, -1.5, 1.5);
    this.lastY = y;
    this.vel += (v - this.vel) * 0.12;                       // smoothed signed scroll velocity
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.06;   // lerped cursor
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.06;
    const max = document.documentElement.scrollHeight - this.size.h;
    this.progress = max > 0 ? y / max : 0;

    const t = this.reduced ? time * 0.15 : time;
    const u = this.bgUniforms;
    u.uTime.value = t; u.uVel.value = this.vel; u.uProgress.value = this.progress;
    u.uMouse.value.set(this.mouse.x, this.mouse.y);

    this.medias.forEach((m) => m.update(t));
    this.renderer.render(this.scene, this.camera);

    // FPS guardrail: if the average drops under ~38 fps, lower the render resolution (min 60%)
    this.frames++; this.acc += deltaMs;
    if (this.acc >= 2500) {
      const fps = (this.frames * 1000) / this.acc;
      if (!this.warm && fps < 38 && this.quality > 0.6) { this.quality = Math.max(0.6, this.quality - 0.2); this.applyPixelRatio(); }
      this.warm = false; this.frames = 0; this.acc = 0;
    }
  }

  destroy() {
    window.removeEventListener('pointermove', this._move);
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('orientationchange', this._resize);
    [...this.medias].forEach((m) => m.destroy());
    this.geometry.dispose(); this.bgGeometry.dispose(); this.bgMaterial.dispose();
    this.renderer.dispose();
  }
}
