import * as THREE from 'three';
// Importa a classe Three.js pura do CloudsRenderer
import { CloudsRenderer } from './Clouds/CloudsRenderer';

export class VolumetricClouds {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer; // Instância do THREE.WebGLRenderer

    const size = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // 1. Instancia o renderizador das nuvens volumétricas
    this.cloudsRenderer = new CloudsRenderer(this.renderer, size);

    // 2. Cria a caixa que delimita onde as nuvens são renderizadas
    const boxSize = 2000; // Ajuste o tamanho da área do céu conforme seu mapa
    const geometry = new THREE.BoxGeometry(boxSize, 400, boxSize);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0 // Usado apenas como volume de colisão/máscara para o raymarching
    });

    this.targetMesh = new THREE.Mesh(geometry, material);
    this.targetMesh.position.y = 250; // Altitude onde as nuvens ficam
    this.scene.add(this.targetMesh);

    // 3. Listener para redimensionar com a janela
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    if (this.cloudsRenderer) {
      this.cloudsRenderer.resize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }

  update(delta) {
    if (this.cloudsRenderer && this.targetMesh) {
      // Executa o passo de renderização e raymarching das nuvens
      this.cloudsRenderer.render(delta, this.targetMesh, this.camera, this.scene);
    }
  }
}