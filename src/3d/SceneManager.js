/**
 * SCENE MANAGER - THREE.JS WEBGL RENDER PIPELINE
 * Manages canvas lifecycle, lighting, camera choreographies, and fallback logic.
 */

import { KineticCore } from './KineticCore.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.core = null;
    this.isWebGLSupported = true;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollProgress = 0;
    this.clock = null;
    this.animationFrameId = null;

    this.init();
  }

  async init() {
    try {
      // Dynamic import Three.js with fallback
      let THREE;
      if (window.THREE) {
        THREE = window.THREE;
      } else {
        const module = await import('https://esm.sh/three@0.160.0');
        THREE = module.default || module;
      }

      this.THREE = THREE;
      this.clock = new THREE.Clock();

      this.setupScene();
      this.setupCamera();
      this.setupLights();
      this.setupRenderer();
      this.setupCore();
      this.setupEventListeners();
      this.render();

      console.log('[SceneManager] Three.js WebGL Core Active');
    } catch (err) {
      console.warn('[SceneManager] WebGL initialization fallback invoked:', err);
      this.renderFallback2D();
    }
  }

  setupScene() {
    this.scene = new this.THREE.Scene();
    this.scene.fog = new this.THREE.FogExp2(0x060709, 0.05);
  }

  setupCamera() {
    const { THREE } = this;
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 7.2);
  }

  setupLights() {
    const { THREE } = this;

    // Ambient baseline
    const ambientLight = new THREE.AmbientLight(0x1a1f2c, 1.2);
    this.scene.add(ambientLight);

    // Key studio light (cool titanium)
    const keyLight = new THREE.DirectionalLight(0xdde5f5, 2.5);
    keyLight.position.set(6, 8, 5);
    this.scene.add(keyLight);

    // Razor-sharp Rim Light (amber accent)
    const rimLight = new THREE.DirectionalLight(0xff8533, 3.8);
    rimLight.position.set(-6, -4, -4);
    this.scene.add(rimLight);

    // Top soft fill
    const topLight = new THREE.PointLight(0xffffff, 1.0, 15);
    topLight.position.set(0, 6, 2);
    this.scene.add(topLight);
  }

  setupRenderer() {
    const { THREE } = this;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'webgl-canvas';
    this.container.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Handle context loss
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      cancelAnimationFrame(this.animationFrameId);
      this.renderFallback2D();
    });
  }

  setupCore() {
    this.core = new KineticCore(this.THREE);
    this.scene.add(this.core.group);

    // Subtle background particulate grid
    const { THREE } = this;
    const particleCount = 200;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 15 - 2;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x8892b0,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    this.particles = new THREE.Points(geom, mat);
    this.scene.add(this.particles);
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  onScroll() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = scrollMax > 0 ? window.scrollY / scrollMax : 0;
  }

  render() {
    this.animationFrameId = requestAnimationFrame(this.render.bind(this));

    const delta = this.clock ? this.clock.getDelta() : 0.016;

    // Smooth mouse lerp
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    if (this.core) {
      this.core.update(delta, this.scrollProgress, this.mouseX, this.mouseY);
    }

    if (this.particles) {
      this.particles.rotation.y = this.scrollProgress * 0.5 + this.mouseX * 0.1;
      this.particles.rotation.x = this.mouseY * 0.1;
    }

    // Camera choreography tied to viewport scroll
    if (this.camera) {
      const targetZ = 7.2 - Math.sin(this.scrollProgress * Math.PI) * 1.8;
      const targetX = this.mouseX * 0.5 + (this.scrollProgress > 0.15 && this.scrollProgress < 0.65 ? 1.8 : 0);
      this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
      this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
      this.camera.lookAt(0, 0, 0);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  renderFallback2D() {
    if (this.canvas) this.canvas.remove();

    const fallback = document.createElement('div');
    fallback.className = 'canvas-fallback';
    fallback.innerHTML = `
      <div class="fallback-rings">
        <div class="fallback-ring fallback-ring--1"></div>
        <div class="fallback-ring fallback-ring--2"></div>
        <div class="fallback-ring fallback-ring--3"></div>
        <div class="fallback-nucleus"></div>
      </div>
    `;
    this.container.appendChild(fallback);
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScroll);
    if (this.renderer) this.renderer.dispose();
  }
}
