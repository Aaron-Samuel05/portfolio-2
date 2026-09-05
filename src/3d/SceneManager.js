/** SCENE MANAGER - THREE.JS WEBGL RENDER PIPELINE */
import { KineticCore } from './KineticCore.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container=canvasContainer; this.canvas=null; this.renderer=null; this.scene=null; this.camera=null; this.core=null; this.isWebGLSupported=true;
    this.isReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.mouseX=0; this.mouseY=0; this.targetMouseX=0; this.targetMouseY=0; this.scrollProgress=0; this.clock=null; this.animationFrameId=null;
    this.init();
  }
  async init(){
    try{let THREE;if(window.THREE)THREE=window.THREE;else{const module=await import('https://esm.sh/three@0.160.0');THREE=module.default||module;}
      this.THREE=THREE; this.clock=new THREE.Clock(); this.setupScene(); this.setupCamera(); this.setupLights(); this.setupRenderer(); this.setupCore(); this.setupEventListeners(); this.render();
    }catch(err){console.warn('[SceneManager] WebGL fallback:',err);this.renderFallback2D();}
  }
  setupScene(){this.scene=new this.THREE.Scene();this.scene.fog=new this.THREE.FogExp2(0x0b1018,.045);}
  setupCamera(){const {THREE}=this,aspect=window.innerWidth/window.innerHeight;this.camera=new THREE.PerspectiveCamera(42,aspect,.1,100);this.camera.position.set(0,.15,7.6);}
  setupLights(){const {THREE}=this;
    const ambientLight=new THREE.AmbientLight(0x1a2535,1.45);this.scene.add(ambientLight);
    const keyLight=new THREE.DirectionalLight(0xdde5f5,2.7);keyLight.position.set(6,8,5);this.scene.add(keyLight);
    const rimLight=new THREE.DirectionalLight(0xff8533,4.2);rimLight.position.set(-6,-4,-4);this.scene.add(rimLight);
    const cyanLight=new THREE.PointLight(0x45c7ff,1.8,14);cyanLight.position.set(5,1,3);this.scene.add(cyanLight);
    const topLight=new THREE.PointLight(0xffffff,1,15);topLight.position.set(0,6,2);this.scene.add(topLight);
  }
  setupRenderer(){const {THREE}=this;this.canvas=document.createElement('canvas');this.canvas.className='webgl-canvas';this.container.appendChild(this.canvas);this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:true,antialias:window.devicePixelRatio<=1.5,powerPreference:'high-performance'});this.renderer.setSize(window.innerWidth,window.innerHeight);this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(this.animationFrameId);this.renderFallback2D();});}
  setupCore(){this.core=new KineticCore(this.THREE);this.scene.add(this.core.group);const {THREE}=this,particleCount=260,geom=new THREE.BufferGeometry(),positions=new Float32Array(particleCount*3);for(let i=0;i<particleCount*3;i+=3){positions[i]=(Math.random()-.5)*22;positions[i+1]=(Math.random()-.5)*18;positions[i+2]=(Math.random()-.5)*15-2;}geom.setAttribute('position',new THREE.BufferAttribute(positions,3));const mat=new THREE.PointsMaterial({color:0x8aa0ba,size:.028,transparent:true,opacity:.36});this.particles=new THREE.Points(geom,mat);this.scene.add(this.particles);}
  setupEventListeners(){window.addEventListener('resize',this.onResize.bind(this));window.addEventListener('mousemove',this.onMouseMove.bind(this));window.addEventListener('scroll',this.onScroll.bind(this),{passive:true});}
  onResize(){if(!this.camera||!this.renderer)return;const w=window.innerWidth,h=window.innerHeight;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));}
  onMouseMove(e){this.targetMouseX=e.clientX/window.innerWidth*2-1;this.targetMouseY=e.clientY/window.innerHeight*2-1;document.documentElement.style.setProperty('--mouse-x',`${e.clientX}px`);document.documentElement.style.setProperty('--mouse-y',`${e.clientY}px`);}
  onScroll(){const scrollMax=document.documentElement.scrollHeight-window.innerHeight;this.scrollProgress=scrollMax>0?window.scrollY/scrollMax:0;document.documentElement.style.setProperty('--scroll-progress',this.scrollProgress);}
  render(){this.animationFrameId=requestAnimationFrame(this.render.bind(this));const delta=this.clock?this.clock.getDelta():.016;this.mouseX+=(this.targetMouseX-this.mouseX)*.05;this.mouseY+=(this.targetMouseY-this.mouseY)*.05;if(this.core)this.core.update(delta,this.scrollProgress,this.mouseX,this.mouseY);if(this.particles){this.particles.rotation.y=this.scrollProgress*.8+this.mouseX*.1;this.particles.rotation.x=this.mouseY*.1;}if(this.camera){const targetZ=7.6-Math.sin(this.scrollProgress*Math.PI)*1.1;const targetX=this.mouseX*.38;const targetY=.15+Math.sin(this.scrollProgress*Math.PI*2)*.08;this.camera.position.z+=(targetZ-this.camera.position.z)*.045;this.camera.position.x+=(targetX-this.camera.position.x)*.045;this.camera.position.y+=(targetY-this.camera.position.y)*.045;this.camera.lookAt(0,.15,0);}if(this.renderer&&this.scene&&this.camera)this.renderer.render(this.scene,this.camera);}
  renderFallback2D(){if(this.canvas)this.canvas.remove();const fallback=document.createElement('div');fallback.className='canvas-fallback';fallback.innerHTML='<div class="fallback-rings"><div class="fallback-ring fallback-ring--1"></div><div class="fallback-ring fallback-ring--2"></div><div class="fallback-ring fallback-ring--3"></div><div class="fallback-nucleus"></div></div>';this.container.appendChild(fallback);}
  destroy(){if(this.animationFrameId)cancelAnimationFrame(this.animationFrameId);if(this.renderer)this.renderer.dispose();}
}
