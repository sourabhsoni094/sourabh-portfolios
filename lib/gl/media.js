import * as THREE from 'three';
import { gsap } from 'gsap';
import { planeVert, planeFrag } from './shaders';

/**
 * A WebGL plane that follows a DOM element every frame.
 * The DOM element keeps layout, accessibility and parallax transforms;
 * the plane renders the pixels (photo or generative art) with shader effects.
 */
export class Media {
  constructor(stage, el, { src = null, palette = ['#05070d', '#0e7c86', '#ff7a3d'], seed = 0, delay = 0 } = {}) {
    this.stage = stage;
    this.el = el;
    this.delay = delay;
    this.hoverT = 0;
    this.mouseT = new THREE.Vector2(0.5, 0.5);
    this.revealed = false;

    this.uniforms = {
      uTex: { value: null }, uHasTex: { value: 0 }, uTime: { value: 0 }, uHover: { value: 0 },
      uReveal: { value: 0 }, uVel: { value: 0 }, uSeed: { value: seed },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uPlane: { value: new THREE.Vector2(1, 1) }, uImage: { value: new THREE.Vector2(1, 1) },
      uC1: { value: new THREE.Color(palette[0]) }, uC2: { value: new THREE.Color(palette[1]) }, uC3: { value: new THREE.Color(palette[2]) },
    };
    this.material = new THREE.ShaderMaterial({
      vertexShader: planeVert, fragmentShader: planeFrag, uniforms: this.uniforms,
      transparent: true, depthTest: false, depthWrite: false,
    });
    this.mesh = new THREE.Mesh(stage.geometry, this.material);
    this.mesh.renderOrder = 1;
    stage.scene.add(this.mesh);
    stage.medias.add(this);

    if (src) {
      new THREE.TextureLoader().load(src, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        this.uniforms.uImage.value.set(tex.image.width, tex.image.height);
        this.uniforms.uTex.value = tex;
        this.uniforms.uHasTex.value = 1;
      });
    }

    this.onEnter = () => (this.hoverT = 1);
    this.onLeave = () => (this.hoverT = 0);
    this.onMove = (e) => {
      const r = this.el.getBoundingClientRect();
      this.mouseT.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    el.addEventListener('pointerenter', this.onEnter);
    el.addEventListener('pointerleave', this.onLeave);
    el.addEventListener('pointermove', this.onMove);
  }

  update(time) {
    const { w, h } = this.stage.size;
    const r = this.el.getBoundingClientRect();
    const visible = r.width > 0 && r.bottom > -120 && r.top < h + 120;
    this.mesh.visible = visible;
    if (!visible) return;

    // Map DOM rect (px, origin top-left) to the pixel-space orthographic camera (origin centre, y up)
    this.mesh.scale.set(r.width, r.height, 1);
    this.mesh.position.set(r.left + r.width / 2 - w / 2, -(r.top + r.height / 2 - h / 2), 0);

    const u = this.uniforms;
    u.uTime.value = time;
    u.uVel.value = this.stage.vel;
    u.uPlane.value.set(r.width, r.height);
    u.uHover.value += (this.hoverT - u.uHover.value) * 0.08;
    u.uMouse.value.lerp(this.mouseT, 0.15);

    // reveal once the page is ready and the plane is on screen
    if (!this.revealed && this.stage.started && r.top < h * 0.92) {
      this.revealed = true;
      gsap.to(u.uReveal, { value: 1, duration: 1.8, ease: 'power3.out', delay: this.delay });
    }
  }

  destroy() {
    this.el.removeEventListener('pointerenter', this.onEnter);
    this.el.removeEventListener('pointerleave', this.onLeave);
    this.el.removeEventListener('pointermove', this.onMove);
    this.stage.scene.remove(this.mesh);
    this.stage.medias.delete(this);
    this.uniforms.uTex.value?.dispose();
    this.material.dispose();
  }
}
