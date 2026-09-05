/** SCENE MANAGER — CINEMATIC THREE.JS RENDER PIPELINE */
import { KineticCore } from './KineticCore.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer; this.canvas = null; this.renderer = null; this.scene = null; this.camera = null; this.core = null;
    this.isWebGLSupported = true; this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.mouseX = 0; this.mouseY = 0; this.targetMouseX = 0; this.targetMouseY = 0; this.scrollProgress = 0; this.clock = null; this.animationFrameId = null; this.init();
  }
  async init() {
    try { let THREE; if (window.THREE) THREE = window.THREE; else { const module = await import('https://esm.sh/three@0.160.0'); THREE = module.default || module; }
      this.THREE = THREE; this.clock = new THREE.Clock(); this.setupScene(); this.setupCamera(); this.setupLights(); this.setupRenderer(); this.setupCore(); this.setupEventListeners(); this.render();
    } catch (err) { console.warn('[SceneManager] WebGL fallback:', err); this.renderFallback2D(); }
  }
  setupScene() { this.scene = new this.THREE.Scene(); this.scene.background = new this.THREE.Color(0x000000); this.scene.fog = new this.THREE.FogExp2(0x000000, .0045); }
  setupCamera() { const { THREE } = this; this.camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, .1, 100); this.camera.position.set(0, 1.8, 7.1); }
  setupLights() {
    const { THREE } = this;
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const hemi = new THREE.HemisphereLight(0xddeeff, 0x050505, 1.2); this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 7.5); key.position.set(4.5, 8, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.near = .1; key.shadow.camera.far = 30; key.shadow.bias = -.0004; this.scene.add(key);
    const front = new THREE.SpotLight(0xffffff, 18, 18, Math.PI / 5.5, .65, 1.2); front.position.set(0, 6, 9); front.target.position.set(0, 1.7, 0); front.castShadow = true; this.scene.add(front, front.target);
    const warm = new THREE.SpotLight(0xff6a21, 24, 17, Math.PI / 4.5, .7, 1.3); warm.position.set(-6, 4.5, 1.5); warm.target.position.set(0, 1.5, 0); this.scene.add(warm, warm.target);
    const cool = new THREE.SpotLight(0x42cfff, 19, 16, Math.PI / 4.5, .72, 1.3); cool.position.set(6, 5, 2.5); cool.target.position.set(0, 2, 0); this.scene.add(cool, cool.target);
    const kicker = new THREE.PointLight(0xffa45c, 6, 12); kicker.position.set(0, 5, -4); this.scene.add(kicker);
  }
  setupRenderer() { const { THREE } = this; this.canvas = document.createElement('canvas'); this.canvas.className = 'webgl-canvas'; this.container.appendChild(this.canvas); this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: true, powerPreference: 'high-performance' }); this.renderer.setClearColor(0x000000, 1); this.renderer.setSize(window.innerWidth, window.innerHeight); this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.72; this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; this.canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(this.animationFrameId); this.renderFallback2D(); }); }
  setupCore() { this.core = new KineticCore(this.THREE); this.scene.add(this.core.group); this.core.group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } }); const { THREE } = this; const count = 100; const geom = new THREE.BufferGeometry(); const positions = new Float32Array(count * 3); for (let i = 0; i < count * 3; i += 3) { positions[i] = (Math.random() - .5) * 18; positions[i + 1] = Math.random() * 9; positions[i + 2] = (Math.random() - .5) * 10 - 2; } geom.setAttribute('position', new THREE.BufferAttribute(positions, 3)); this.particles = new THREE.Points(geom, new THREE.PointsMaterial({ color: 0xffd0a8, size: .018, transparent: true, opacity: .22 })); this.scene.add(this.particles); }
  setupEventListeners() { window.addEventListener('resize', this.onResize.bind(this)); window.addEventListener('mousemove', this.onMouseMove.bind(this)); window.addEventListener('scroll', this.onScroll.bind(this), { passive: true }); }
  onResize() { if (!this.camera || !this.renderer) return; const w = window.innerWidth, h = window.innerHeight; this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); }
  onMouseMove(e) { this.targetMouseX = e.clientX / window.innerWidth * 2 - 1; this.targetMouseY = e.clientY / window.innerHeight * 2 - 1; document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`); document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`); }
  onScroll() { const max = document.documentElement.scrollHeight - window.innerHeight; this.scrollProgress = max > 0 ? window.scrollY / max : 0; document.documentElement.style.setProperty('--scroll-progress', this.scrollProgress); }
  render() { this.animationFrameId = requestAnimationFrame(this.render.bind(this)); const delta = this.clock ? this.clock.getDelta() : .016; this.mouseX += (this.targetMouseX - this.mouseX) * .05; this.mouseY += (this.targetMouseY - this.mouseY) * .05; if (this.core) this.core.update(delta, this.scrollProgress, this.mouseX, this.mouseY); if (this.particles) { this.particles.rotation.y = this.scrollProgress * .35 + this.mouseX * .04; this.particles.rotation.x = this.mouseY * .03; } if (this.camera) { const targetZ = 7.1 - Math.sin(this.scrollProgress * Math.PI) * .6; const targetX = this.mouseX * .16; const targetY = 1.75 + Math.sin(this.scrollProgress * Math.PI * 2) * .04; this.camera.position.z += (targetZ - this.camera.position.z) * .04; this.camera.position.x += (targetX - this.camera.position.x) * .04; this.camera.position.y += (targetY - this.camera.position.y) * .04; this.camera.lookAt(0, 1.8, 0); } if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera); }
  renderFallback2D() { if (this.canvas) this.canvas.remove(); const fallback = document.createElement('div'); fallback.className = 'canvas-fallback'; fallback.innerHTML = '<div class="fallback-rings"><div class="fallback-ring fallback-ring--1"></div><div class="fallback-ring fallback-ring--2"></div><div class="fallback-ring fallback-ring--3"></div><div class="fallback-nucleus"></div></div>'; this.container.appendChild(fallback); }
  destroy() { if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId); if (this.renderer) this.renderer.dispose(); }
}
