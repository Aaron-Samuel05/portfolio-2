/**
 * KINETIC CORE - 3D PROCEDURAL GEOMETRY & MATERIALS
 * Precision-engineered metallic computational object.
 */

export class KineticCore {
  constructor(THREE) {
    this.THREE = THREE;
    this.group = new THREE.Group();
    this.rings = [];
    this.nodes = [];
    this.time = 0;

    this.createCore();
    this.createNestedRings();
    this.createLattice();
    this.createNucleus();
  }

  createCore() {
    const { THREE } = this;

    // Premium physical metallic material
    this.metallicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd0d5dd,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.95,
      wireframe: false,
    });

    this.accentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff8533,
      emissive: 0xff6600,
      emissiveIntensity: 0.45,
      metalness: 0.8,
      roughness: 0.25,
      clearcoat: 1.0,
    });

    this.darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      metalness: 0.85,
      roughness: 0.35,
    });
  }

  createNestedRings() {
    const { THREE } = this;

    // Outer Gyroscope Ring 1
    const geom1 = new THREE.TorusGeometry(2.4, 0.045, 32, 100);
    const ring1 = new THREE.Mesh(geom1, this.metallicMaterial);
    ring1.rotation.x = Math.PI / 4;
    this.group.add(ring1);
    this.rings.push({ mesh: ring1, rx: 0.003, ry: 0.005, rz: 0.002 });

    // Mid Precision Ring 2
    const geom2 = new THREE.TorusGeometry(1.9, 0.035, 32, 100);
    const ring2 = new THREE.Mesh(geom2, this.darkMetalMaterial);
    ring2.rotation.y = Math.PI / 3;
    this.group.add(ring2);
    this.rings.push({ mesh: ring2, rx: -0.004, ry: 0.003, rz: 0.004 });

    // Inner Accent Ring 3
    const geom3 = new THREE.TorusGeometry(1.4, 0.028, 24, 80);
    const ring3 = new THREE.Mesh(geom3, this.accentMaterial);
    ring3.rotation.z = Math.PI / 6;
    this.group.add(ring3);
    this.rings.push({ mesh: ring3, rx: 0.006, ry: -0.005, rz: 0.003 });

    // Equatorial Tick Markers around Ring 1
    const markerCount = 16;
    for (let i = 0; i < markerCount; i++) {
      const angle = (i / markerCount) * Math.PI * 2;
      const markerGeom = new THREE.BoxGeometry(0.04, 0.12, 0.04);
      const marker = new THREE.Mesh(markerGeom, this.accentMaterial);
      marker.position.set(Math.cos(angle) * 2.4, Math.sin(angle) * 2.4, 0);
      marker.rotation.z = angle;
      ring1.add(marker);
    }
  }

  createLattice() {
    const { THREE } = this;

    // Central Geodesic Icosahedron Lattice
    const icoGeom = new THREE.IcosahedronGeometry(0.9, 1);
    const wireGeom = new THREE.WireframeGeometry(icoGeom);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    this.lattice = new THREE.LineSegments(wireGeom, lineMat);
    this.group.add(this.lattice);

    // Nodes at vertices
    const pos = icoGeom.getAttribute('position');
    const nodeGeom = new THREE.SphereGeometry(0.035, 12, 12);
    for (let i = 0; i < pos.count; i++) {
      const node = new THREE.Mesh(nodeGeom, this.accentMaterial);
      node.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      this.lattice.add(node);
      this.nodes.push(node);
    }
  }

  createNucleus() {
    const { THREE } = this;

    // Radiant energy nucleus
    const nucleusGeom = new THREE.SphereGeometry(0.35, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffa34d,
      wireframe: false,
    });
    this.nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    this.group.add(this.nucleus);

    // Inner pulsing point light
    this.coreLight = new THREE.PointLight(0xff8533, 2.8, 10);
    this.group.add(this.coreLight);
  }

  update(delta, scrollProgress = 0, mouseX = 0, mouseY = 0) {
    this.time += delta;

    // Rotate nested rings with differentiated orbital frequencies
    this.rings.forEach((r, idx) => {
      r.mesh.rotation.x += r.rx * (1 + scrollProgress * 1.5);
      r.mesh.rotation.y += r.ry * (1 + scrollProgress * 1.5);
      r.mesh.rotation.z += r.rz * (1 + scrollProgress * 1.5);
    });

    // Rotate internal lattice
    if (this.lattice) {
      this.lattice.rotation.x -= 0.005;
      this.lattice.rotation.y += 0.008;
    }

    // Pulse the core nucleus
    const pulse = Math.sin(this.time * 2.5) * 0.12 + 1.0;
    if (this.nucleus) {
      this.nucleus.scale.set(pulse, pulse, pulse);
    }
    if (this.coreLight) {
      this.coreLight.intensity = 2.2 + Math.sin(this.time * 3.0) * 0.9;
    }

    // Interactive target rotation based on cursor & scroll
    const targetRotY = mouseX * 0.45 + scrollProgress * Math.PI * 2.5;
    const targetRotX = -mouseY * 0.45 + Math.sin(scrollProgress * Math.PI) * 0.5;

    this.group.rotation.y += (targetRotY - this.group.rotation.y) * 0.06;
    this.group.rotation.x += (targetRotX - this.group.rotation.x) * 0.06;

    // Spatial translation according to scroll phase
    const targetY = -scrollProgress * 2.2 + Math.sin(this.time * 0.8) * 0.12;
    this.group.position.y += (targetY - this.group.position.y) * 0.08;
  }
}
