/**
 * KINETIC CORE — PROCEDURAL GAMING PC HERO
 * A premium, game-launch-inspired desktop PC built entirely in Three.js.
 * The machine takes the opening spotlight, then responds to scroll.
 */
export class KineticCore {
  constructor(THREE) {
    this.THREE = THREE;
    this.group = new THREE.Group();
    this.pc = new THREE.Group();
    this.fans = [];
    this.ram = [];
    this.time = 0;
    this.introSpinDuration = 2.55;
    this.createMaterials();
    this.createPC();
    this.createPlatform();
    this.createAccentLights();
    this.group.add(this.pc);
  }

  createMaterials() {
    const { THREE } = this;
    // Graphite rather than near-black materials so the silhouette catches the studio lights.
    this.caseBlack = new THREE.MeshPhysicalMaterial({ color: 0x202631, metalness: .86, roughness: .24, clearcoat: 1, clearcoatRoughness: .12 });
    this.caseMetal = new THREE.MeshPhysicalMaterial({ color: 0x4a5361, metalness: .9, roughness: .2, clearcoat: 1, clearcoatRoughness: .1 });
    this.glass = new THREE.MeshPhysicalMaterial({ color: 0x8296aa, metalness: .08, roughness: .06, transmission: .08, transparent: true, opacity: .22, side: THREE.DoubleSide, clearcoat: 1 });
    this.orange = new THREE.MeshPhysicalMaterial({ color: 0xff8a3d, emissive: 0xff4b0b, emissiveIntensity: 3.2, metalness: .5, roughness: .16, clearcoat: .7 });
    this.cyan = new THREE.MeshPhysicalMaterial({ color: 0x6ee1ff, emissive: 0x19bfff, emissiveIntensity: 2.6, metalness: .35, roughness: .18 });
    this.white = new THREE.MeshPhysicalMaterial({ color: 0xf2f6ff, emissive: 0x5f7896, emissiveIntensity: .45, metalness: .2, roughness: .22 });
    this.dark = new THREE.MeshStandardMaterial({ color: 0x151a22, roughness: .5, metalness: .4 });
    this.gpu = new THREE.MeshPhysicalMaterial({ color: 0x596575, emissive: 0x111722, emissiveIntensity: .5, metalness: .84, roughness: .2, clearcoat: 1 });
  }

  addBox(geometry, material, position, scale = [1, 1, 1], parent = this.pc) {
    const mesh = new this.THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }

  createPC() {
    const { THREE } = this;
    this.addBox(new THREE.BoxGeometry(3.25, 4.35, 2.25), this.caseBlack, [0, 2.2, 0]);
    this.addBox(new THREE.BoxGeometry(2.96, 4.02, .075), this.glass, [0, 2.28, 1.14]);
    this.addBox(new THREE.BoxGeometry(.16, 4.05, .16), this.caseMetal, [-1.48, 2.25, 1.18]);
    this.addBox(new THREE.BoxGeometry(.16, 4.05, .16), this.caseMetal, [1.48, 2.25, 1.18]);
    this.addBox(new THREE.BoxGeometry(3.02, .14, .14), this.caseMetal, [0, .25, 1.18]);
    this.addBox(new THREE.BoxGeometry(3.02, .14, .14), this.caseMetal, [0, 4.27, 1.18]);

    this.addBox(new THREE.BoxGeometry(2.55, 3.5, .08), this.caseMetal, [0, 2.25, -.98]);

    // GPU — visual centerpiece.
    this.addBox(new THREE.BoxGeometry(2.35, .46, .72), this.gpu, [.18, 1.48, .48]);
    this.addBox(new THREE.BoxGeometry(.11, .31, .58), this.orange, [-.95, 1.48, .48]);
    this.addBox(new THREE.BoxGeometry(.72, .035, .08), this.cyan, [.38, 1.72, .86]);
    this.addBox(new THREE.BoxGeometry(.72, .035, .08), this.orange, [.38, 1.25, .86]);

    // CPU block + tubes.
    this.addBox(new THREE.BoxGeometry(.72, .72, .2), this.caseMetal, [-.45, 2.55, .38]);
    this.addBox(new THREE.BoxGeometry(.52, .52, .22), this.orange, [-.45, 2.55, .5]);
    for (let i = 0; i < 2; i++) {
      const tube = new THREE.Mesh(new THREE.TorusGeometry(.42 + i * .05, .035, 8, 32, Math.PI * 1.15), this.orange);
      tube.rotation.x = Math.PI / 2;
      tube.rotation.z = -.65;
      tube.position.set(.05, 2.55 + i * .1, .46);
      this.pc.add(tube);
    }

    for (let i = 0; i < 4; i++) {
      const stick = this.addBox(new THREE.BoxGeometry(.13, 1.35, .09), this.orange, [-.02 + i * .19, 2.72, .42]);
      this.ram.push(stick);
    }

    const fanGeom = new THREE.CylinderGeometry(.57, .57, .08, 40);
    for (let i = 0; i < 3; i++) {
      const fan = new THREE.Mesh(fanGeom, this.dark);
      fan.rotation.x = Math.PI / 2;
      fan.position.set(1.02, 1.25 + i * 1.08, 1.02);
      this.pc.add(fan);
      this.fans.push(fan);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(.48, .055, 12, 56), this.cyan);
      ring.position.copy(fan.position);
      this.pc.add(ring);
      this.fans.push(ring);
    }

    for (let i = 0; i < 2; i++) {
      const fan = new THREE.Mesh(new THREE.CylinderGeometry(.48, .48, .07, 40), this.dark);
      fan.rotation.z = Math.PI / 2;
      fan.position.set(-.55 + i * 1.1, 4.05, 0);
      this.pc.add(fan);
      this.fans.push(fan);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.4, .045, 12, 48), this.orange);
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(fan.position);
      this.pc.add(ring);
      this.fans.push(ring);
    }

    this.addBox(new THREE.BoxGeometry(.55, .05, .08), this.cyan, [-.65, .42, 1.16]);
    this.addBox(new THREE.CylinderGeometry(.08, .08, .035, 24), this.orange, [.72, .44, 1.18]);
  }

  createPlatform() {
    const { THREE } = this;
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.72, .16, 64), new THREE.MeshPhysicalMaterial({ color: 0x11151c, metalness: .95, roughness: .16, clearcoat: 1 }));
    platform.position.y = -.08;
    this.group.add(platform);
    const orangeRing = new THREE.Mesh(new THREE.TorusGeometry(2.42, .025, 10, 96), this.orange);
    orangeRing.rotation.x = Math.PI / 2;
    orangeRing.position.y = .02;
    this.group.add(orangeRing);
    const whiteRing = new THREE.Mesh(new THREE.TorusGeometry(2.55, .018, 10, 96), this.white);
    whiteRing.rotation.x = Math.PI / 2;
    whiteRing.position.y = .035;
    this.group.add(whiteRing);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(6.5, 64), new THREE.MeshBasicMaterial({ color: 0x020204, transparent: true, opacity: .94 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.18;
    this.group.add(floor);
  }

  createAccentLights() {
    const { THREE } = this;
    this.orangeLight = new THREE.PointLight(0xff6b1a, 11, 11);
    this.orangeLight.position.set(-3, 2.2, 3.8);
    this.group.add(this.orangeLight);
    this.cyanLight = new THREE.PointLight(0x4fcfff, 8, 10);
    this.cyanLight.position.set(3.4, 3.8, 2.2);
    this.group.add(this.cyanLight);

    // Interior practical lights make the hardware visible through the glass.
    this.innerWarm = new THREE.PointLight(0xff7133, 5.5, 5.5);
    this.innerWarm.position.set(-.7, 2.2, 1.05);
    this.pc.add(this.innerWarm);
    this.innerCool = new THREE.PointLight(0x45d8ff, 4.5, 5.5);
    this.innerCool.position.set(1.05, 2.6, .95);
    this.pc.add(this.innerCool);
  }

  update(delta, scrollProgress = 0, mouseX = 0, mouseY = 0) {
    this.time += delta;
    const introActive = this.time < this.introSpinDuration;
    const introT = Math.min(this.time / this.introSpinDuration, 1);
    const eased = 1 - Math.pow(1 - introT, 3);
    const introRotation = Math.PI * 2.1 * eased;
    const scrollRotation = scrollProgress * Math.PI * 4.5 + mouseX * .2;
    const targetY = introActive ? introRotation : scrollRotation;
    const targetX = -mouseY * .1 + Math.sin(scrollProgress * Math.PI) * .04;
    this.pc.rotation.y += (targetY - this.pc.rotation.y) * .075;
    this.pc.rotation.x += (targetX - this.pc.rotation.x) * .06;
    this.pc.rotation.z += (Math.sin(scrollProgress * Math.PI * 2) * .025 - this.pc.rotation.z) * .05;
    this.pc.position.y += ((Math.sin(this.time * 1.25) * .035 + Math.sin(scrollProgress * Math.PI * 2) * .08) - this.pc.position.y) * .06;

    this.fans.forEach((fan, i) => {
      fan.rotation.z += delta * (i % 2 ? 1.2 : -.9);
    });
    this.ram.forEach((stick, i) => {
      stick.material.emissiveIntensity = 2.0 + Math.sin(this.time * 2 + i * .7) * .8;
    });
    this.orangeLight.intensity = 10 + Math.sin(this.time * 2.1) * 1.5;
    this.cyanLight.intensity = 7 + Math.sin(this.time * 1.7 + 1) * 1.2;
    this.innerWarm.intensity = 5 + Math.sin(this.time * 1.8) * .8;
    this.innerCool.intensity = 4 + Math.sin(this.time * 1.55 + 1) * .7;
  }
}
