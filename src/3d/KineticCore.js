/**
 * KINETIC CORE - PROCEDURAL 3D HERO OBJECT
 * Stylized midnight street-racer silhouette. The opening gives the vehicle
 * a full cinematic spin before handing rotation over to page scroll.
 */
export class KineticCore {
  constructor(THREE) {
    this.THREE = THREE; this.group = new THREE.Group(); this.vehicle = new THREE.Group(); this.rings = []; this.wheels = []; this.time = 0;
    this.introSpinDuration = 2.15;
    this.createMaterials(); this.createVehicle(); this.createOrbitalDetails(); this.createNucleus(); this.group.add(this.vehicle);
  }
  createMaterials() {
    const { THREE } = this;
    this.paint = new THREE.MeshPhysicalMaterial({ color: 0x26374b, metalness: .88, roughness: .19, clearcoat: 1, clearcoatRoughness: .08 });
    this.paintDark = new THREE.MeshPhysicalMaterial({ color: 0x0c121b, metalness: .92, roughness: .23, clearcoat: .8 });
    this.glass = new THREE.MeshPhysicalMaterial({ color: 0x101b29, metalness: .25, roughness: .08, transmission: .18, transparent: true, opacity: .9 });
    this.orange = new THREE.MeshPhysicalMaterial({ color: 0xff8738, emissive: 0xff4d00, emissiveIntensity: .5, metalness: .72, roughness: .2, clearcoat: 1 });
    this.cyan = new THREE.MeshBasicMaterial({ color: 0x45c7ff });
    this.tyre = new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: .72, metalness: .12 });
    this.rim = new THREE.MeshStandardMaterial({ color: 0xaeb9c9, roughness: .22, metalness: .9 });
  }
  createVehicle() {
    const { THREE } = this;
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.25,.62,1.45), this.paint); body.position.y=.35; this.vehicle.add(body);
    const nose = new THREE.Mesh(new THREE.BoxGeometry(1.05,.38,1.3), this.paintDark); nose.position.set(1.25,.56,0); nose.rotation.z=-.08; this.vehicle.add(nose);
    const rear = new THREE.Mesh(new THREE.BoxGeometry(.72,.55,1.38), this.paintDark); rear.position.set(-1.34,.58,0); this.vehicle.add(rear);
    const cabin = new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2), this.glass); cabin.scale.set(1.05,.55,.62); cabin.position.set(-.15,.82,0); this.vehicle.add(cabin);
    [-.66,.66].forEach(z=>{const blade=new THREE.Mesh(new THREE.BoxGeometry(2.45,.08,.12),this.orange); blade.position.set(0,.27,z); this.vehicle.add(blade);});
    const lightBar=new THREE.Mesh(new THREE.BoxGeometry(.12,.07,1),this.cyan); lightBar.position.set(1.78,.51,0); this.vehicle.add(lightBar);
    const tailBar=new THREE.Mesh(new THREE.BoxGeometry(.08,.07,.95),this.orange); tailBar.position.set(-1.72,.58,0); this.vehicle.add(tailBar);
    const wheelGeom=new THREE.CylinderGeometry(.42,.42,.23,20), rimGeom=new THREE.CylinderGeometry(.22,.22,.245,16);
    [[1.05,-.73],[1.05,.73],[-1.05,-.73],[-1.05,.73]].forEach(([x,z])=>{
      const wheel=new THREE.Mesh(wheelGeom,this.tyre); wheel.rotation.x=Math.PI/2; wheel.position.set(x,.05,z); this.vehicle.add(wheel); this.wheels.push(wheel);
      const rim=new THREE.Mesh(rimGeom,this.rim); rim.rotation.x=Math.PI/2; rim.position.set(x,.05,z); this.vehicle.add(rim);
    });
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(2.35,48),new THREE.MeshBasicMaterial({color:0x06101a,transparent:true,opacity:.7})); shadow.rotation.x=-Math.PI/2; shadow.position.y=-.39; shadow.scale.set(1.35,.45,1); this.vehicle.add(shadow);
  }
  createOrbitalDetails() {
    const { THREE } = this;
    [[2.65,.018,0xff8738,.34],[2.15,.012,0x45c7ff,-.55]].forEach(([radius,tube,color,tilt])=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,12,96),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.48})); ring.rotation.x=Math.PI/2.2; ring.rotation.z=tilt; this.group.add(ring); this.rings.push(ring);});
    const grid=new THREE.GridHelper(9,28,0x33465c,0x1a2939); grid.material.transparent=true; grid.material.opacity=.2; grid.position.y=-.43; this.group.add(grid); this.grid=grid;
  }
  createNucleus(){const {THREE}=this; this.coreLight=new THREE.PointLight(0xff7a2e,2.6,9); this.coreLight.position.set(0,.7,0); this.group.add(this.coreLight);}
  update(delta,scrollProgress=0,mouseX=0,mouseY=0){
    this.time+=delta;

    // Opening title sequence: a deliberate 360°+ hero spin before any copy appears.
    const introActive=this.time<this.introSpinDuration;
    const introT=Math.min(this.time/this.introSpinDuration,1);
    const easedIntro=1-Math.pow(1-introT,3);
    const introRotation=Math.PI*2.25*easedIntro;
    const scrollRotation=mouseX*.28+scrollProgress*Math.PI*6;
    const targetRotY=introActive?introRotation:scrollRotation;
    const targetRotX=-mouseY*.18+Math.sin(scrollProgress*Math.PI*2)*.12;
    const targetRotZ=Math.sin(scrollProgress*Math.PI*2)*.045;
    this.vehicle.rotation.y+=(targetRotY-this.vehicle.rotation.y)*.09;
    this.vehicle.rotation.x+=(targetRotX-this.vehicle.rotation.x)*.075;
    this.vehicle.rotation.z+=(targetRotZ-this.vehicle.rotation.z)*.075;

    const targetY=Math.sin(scrollProgress*Math.PI*3)*.18+Math.sin(this.time*1.3)*.035;
    this.vehicle.position.y+=(targetY-this.vehicle.position.y)*.07;
    this.rings.forEach((ring,index)=>{ring.rotation.y+=(index?-1:1)*delta*.28; ring.rotation.x+=delta*.06;});
    this.wheels.forEach(wheel=>wheel.rotation.z+=delta*.8);
    if(this.grid)this.grid.position.x=Math.sin(this.time*.12)*.08;
    if(this.coreLight)this.coreLight.intensity=2.2+Math.sin(this.time*2.4)*.45;
  }
}
