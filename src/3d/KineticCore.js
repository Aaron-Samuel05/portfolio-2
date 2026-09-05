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
    this.caseBlack = new THREE.MeshPhysicalMaterial({ color: 0x090a0d, metalness: .9, roughness: .2, clearcoat: .75 });
    this.caseMetal = new THREE.MeshPhysicalMaterial({ color: 0x181b22, metalness: .96, roughness: .2, clearcoat: 1 });
    this.glass = new THREE.MeshPhysicalMaterial({ color: 0x101823, metalness: .12, roughness: .05, transmission: .18, transparent: true, opacity: .36, side: THREE.DoubleSide });
    this.orange = new THREE.MeshPhysicalMaterial({ color: 0xff7b24, emissive: 0xff3d00, emissiveIntensity: 2.1, metalness: .55, roughness: .18 });
    this.cyan = new THREE.MeshBasicMaterial({ color: 0x8edcff });
    this.white = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.dark = new THREE.MeshStandardMaterial({ color: 0x020304, roughness: .78, metalness: .18 });
    this.gpu = new THREE.MeshPhysicalMaterial({ color: 0x252a32, metalness: .82, roughness: .24, clearcoat: .7 });
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
    // Main tower with bevelled-looking layered frame.
    this.addBox(new THREE.BoxGeometry(3.25, 4.35, 2.25), this.caseBlack, [0, 2.2, 0]);
    this.addBox(new THREE.BoxGeometry(2.96, 4.02, .075), this.glass, [0, 2.28, 1.14]);
    this.addBox(new THREE.BoxGeometry(.16, 4.05, .16), this.caseMetal, [-1.48, 2.25, 1.18]);
    this.addBox(new THREE.BoxGeometry(.16, 4.05, .16), this.caseMetal, [1.48, 2.25, 1.18]);
    this.addBox(new THREE.BoxGeometry(3.02, .14, .14), this.caseMetal, [0, .25, 1.18]);
    this.addBox(new THREE.BoxGeometry(3.02, .14, .14), this.caseMetal, [0, 4.27, 1.18]);

    // Motherboard / backplane.
    this.addBox(new THREE.BoxGeometry(2.55, 3.5, .08), this.caseMetal, [0, 2.25, -.98]);

    // GPU — the visual centerpiece inside the glass.
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

    // Four RAM sticks with independent glow.
    for (let i = 0; i < 4; i++) {
      const stick = this.addBox(new THREE.BoxGeometry(.13, 1.35, .09), this.orange, [-.02 + i * .19, 2.72, .42]);
      this.ram.push(stick);
    }

    // Front intake fans.
    const fanGeom = new THREE.CylinderGeometry(.57, .57, .08, 32);
    for (let i = 0; i < 3; i++) {
      const fan = new THREE.Mesh(fanGeom, this.dark);
      fan.rotation.x = Math.PI / 2;
      fan.position.set(1.02, 1.25 + i * 1.08, 1.02);
      this.pc.add(fan);
      this.fans.push(fan);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(.48, .045, 10, 48), this.orange);
      ring.position.copy(fan.position);
      this.pc.add(ring);
      this.fans.push(ring);
    }

    // Top-mounted liquid-cooling fans.
    for (let i = 0; i < 2; i++) {
      const fan = new THREE.Mesh(new THREE.CylinderGeometry(.48, .48, .07, 32), this.dark);
      fan.rotation.z = Math.PI / 2;
      fan.position.set(-.55 + i * 1.1, 4.05, 0);
      this.pc.add(fan);
      this.fans.push(fan);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.4, .04, 10, 40), this.cyan);
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(fan.position);
      this.pc.add(ring);
      this.fans.push(ring);
    }

    // Minimal front I/O and power button.
    this.addBox(new THREE.BoxGeometry(.55, .05, .08), this.cyan, [-.65, .42, 1.16]);
    this.addBox(new THREE.CylinderGeometry(.08, .08, .035, 24), this.orange, [.72, .44, 1.18]);
  }

  createPlatform() {
    const { THREE } = this;
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.72, .16, 64), new THREE.MeshPhysicalMaterial({ color: 0x07080b, metalness: .95, roughness: .16, clearcoat: 1 }));
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
    const floor = new THREE.Mesh(new THREE.CircleGeometry(6.5, 64), new THREE.MeshBasicMaterial({ color: 0x010101, transparent: true, opacity: .92 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.18;
    this.group.add(floor);
  }

  createAccentLights() {
    const { THREE } = this;
    this.orangeLight = new THREE.PointLight(0xff6b1a, 8, 9);
    this.orangeLight.position.set(-3, 2.2, 2.5);
    this.group.add(this.orangeLight);
    this.cyanLight = new THREE.PointLight(0x4fcfff, 5, 8);
    this.cyanLight.position.set(3, 3.8, -1.5);
    this.group.add(this.cyanLight);
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
      stick.material.emissiveIntensity = 1.1 + Math.sin(this.time * 2 + i * .7) * .55;
    });
    this.orangeLight.intensity = 7 + Math.sin(this.time * 2.1) * 1.2;
    this.cyanLight.intensity = 4.2 + Math.sin(this.time * 1.7 + 1) * .8;
  }
}
