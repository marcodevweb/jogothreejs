import * as THREE from 'three';

import { Terrain } from '../world/Terrain.js';
import { Ocean } from '../world/Ocean.js';
import { Lighting } from './Lighting.js';
import { VolumetricClouds } from '../world/VolumetricClouds.js';

import { Player } from '../player/Player.js';
import { ThirdPersonCamera } from '../player/ThirdPersonCamera.js';

import { Menu } from '../ui/MainMenu.js';
import { HUD } from '../ui/HUD.js';

export class SceneManager {
  constructor(container) {
    this.container = container;

    // Cena.
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    // Câmera.
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8, 12);

    // Renderer.
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    container.appendChild(this.renderer.domElement);

    // Relógio.
    this.clock = new THREE.Clock();
    this.gameStarted = false;

    // Iluminação.
    this.lighting = new Lighting(this.scene);

    // Mundo.
    this.terrain = new Terrain(this.scene);
    this.ocean = new Ocean(this.scene);

    // Nuvens Volumétricas (passando scene, camera e renderer).
    this.clouds = new VolumetricClouds(
      this.scene,
      this.camera,
      this.renderer
    );

    // Câmera.
    this.cameraControls = new ThirdPersonCamera(this.camera, null);

    // Personagem.
    this.player = new Player(
      this.scene,
      this.camera,
      this.terrain,
      this.cameraControls
    );

    this.cameraControls.player = this.player;

    // HUD ainda não aparece no menu.
    this.hud = null;

    // Menu.
    this.menu = new Menu(container, () => this.startGame());

    console.log('[GAME] SceneManager inicializado');
  }

  startGame() {
    if (this.gameStarted) {
      return;
    }

    console.log('[GAME] START GAME');
    this.gameStarted = true;
    console.log('[GAME] gameStarted = true');

    // Cria HUD.
    if (!this.hud) {
      this.hud = new HUD();
    }

    // Pointer Lock.
    try {
      this.renderer.domElement.requestPointerLock();
    } catch (error) {
      console.warn('[GAME] Pointer Lock não disponível:', error);
    }

    console.log('[GAME] Gameplay iniciado');
  }

  update() {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    // Atualiza jogador (Controlador + Animações)
    if (this.player) {
      if (this.gameStarted) {
        this.player.update(delta);
      } else {
        this.player.updateAnimationsOnly(delta);
      }
    }

    // Câmera.
    if (this.cameraControls) {
      this.cameraControls.update();
    }

    // Oceano.
    if (this.ocean) {
      this.ocean.update(time);
    }

    // Nuvens Volumétricas.
    if (this.clouds) {
      this.clouds.update(delta);
    }

    // Render.
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.clouds && typeof this.clouds.onResize === 'function') {
      this.clouds.onResize();
    }
  }
}