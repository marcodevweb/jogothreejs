import * as THREE from 'three';

export class Terrain {
  constructor(scene) {
    this.scene = scene;

    this.size = 100;
    this.segments = 100;

    this.geometry = new THREE.PlaneGeometry(
      this.size,
      this.size,
      this.segments,
      this.segments
    );

    this.geometry.rotateX(-Math.PI / 2);

    const position =
      this.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);

      const distance =
        Math.sqrt(x * x + z * z);

      // Forma básica da ilha.
      const islandFactor =
        THREE.MathUtils.clamp(
          1 - distance / 55,
          0,
          1
        );

      const waves =
        Math.sin(x * 0.10) * 2 +
        Math.cos(z * 0.10) * 2;

      const largerShape =
        Math.sin(x * 0.035) *
        Math.cos(z * 0.045) *
        3;

      let y =
        (waves + largerShape) *
        islandFactor;

      // Centro mais alto.
      y += islandFactor * 2;

      position.setY(i, y);
    }

    this.geometry.computeVertexNormals();

    const material =
      new THREE.MeshStandardMaterial({
        color: 0x2f8f2f,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.DoubleSide
      });

    this.mesh =
      new THREE.Mesh(
        this.geometry,
        material
      );

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;

    scene.add(this.mesh);
  }

  getHeightAt(x, z) {
    const distance =
      Math.sqrt(x * x + z * z);

    const islandFactor =
      THREE.MathUtils.clamp(
        1 - distance / 55,
        0,
        1
      );

    const waves =
      Math.sin(x * 0.10) * 2 +
      Math.cos(z * 0.10) * 2;

    const largerShape =
      Math.sin(x * 0.035) *
      Math.cos(z * 0.045) *
      3;

    let y =
      (waves + largerShape) *
      islandFactor;

    y += islandFactor * 2;

    return y;
  }
}