import * as THREE from 'three';

export class Ocean {
  constructor(scene) {
    this.geometry =
      new THREE.PlaneGeometry(
        500,
        500,
        80,
        80
      );

    this.geometry.rotateX(
      -Math.PI / 2
    );

    this.basePositions =
      this.geometry.attributes.position.array.slice();

    const material =
      new THREE.MeshStandardMaterial({
        color: 0x0879b8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.25,
        metalness: 0.05
      });

    this.mesh =
      new THREE.Mesh(
        this.geometry,
        material
      );

    this.mesh.position.y = -0.8;

    this.mesh.receiveShadow = true;

    scene.add(this.mesh);
  }

  update(time) {
    const positions =
      this.geometry.attributes.position;

    for (
      let i = 0;
      i < positions.count;
      i++
    ) {
      const baseX =
        this.basePositions[i * 3];

      const baseZ =
        this.basePositions[i * 3 + 2];

      const wave =
        Math.sin(
          baseX * 0.04 + time * 1.5
        ) * 0.18 +
        Math.cos(
          baseZ * 0.035 + time * 1.2
        ) * 0.18;

      positions.setY(
        i,
        wave
      );
    }

    positions.needsUpdate = true;

    this.geometry.computeVertexNormals();
  }
}