import * as THREE from 'three';

export class ThirdPersonCamera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;

    // Configurações GTA V Style (ajustadas conforme pedido)
    this.distance = 5; // Aprox 4.5 a 5.5
    this.height = 2.5; // Aprox 2 a 3
    this.phi = Math.PI / 6; // Inclinação vertical inicial
    this.theta = 0; // Rotação horizontal

    this.minDistance = 3;
    this.maxDistance = 8;
    this.minPhi = -Math.PI / 9; // -20 graus
    this.maxPhi = Math.PI / 3.2; // ~55 graus

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        // Rotação horizontal (orbit)
        this.theta -= e.movementX * 0.002;

        // Rotação vertical (pitch)
        this.phi -= e.movementY * 0.002;
        this.phi = Math.max(this.minPhi, Math.min(this.maxPhi, this.phi));
      }
    });

    document.addEventListener('wheel', (e) => {
      this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance + e.deltaY * 0.01));
    });
  }

  update() {
    if (!this.player || !this.player.model) return;

    // Posição alvo (personagem + offset de altura)
    const target = this.player.model.position.clone();
    target.y += this.height;

    // Cálculo da posição da câmera baseado na distância, phi e theta
    const offset = new THREE.Vector3(
      this.distance * Math.sin(this.theta) * Math.cos(this.phi),
      this.distance * Math.sin(this.phi),
      this.distance * Math.cos(this.theta) * Math.cos(this.phi)
    );

    const idealPosition = target.clone().add(offset);

    // Suavização da câmera (lerp)
    this.camera.position.lerp(idealPosition, 0.15);
    this.camera.lookAt(target);
  }

  getYaw() {
    return this.theta;
  }
}
