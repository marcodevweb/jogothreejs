import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class Lighting {
  constructor(scene) {
    this.scene = scene;

    // Ambient/Hemisphere
    const hemisphere = new THREE.HemisphereLight(0xbfe8ff, 0x31522f, 0.5);
    scene.add(hemisphere);

    // Sun
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 150;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    this.sun = sun;

    // Sky
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    scene.add(this.sky);

    const skyUniforms = this.sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    // Sun for Sky
    const phi = THREE.MathUtils.degToRad(90 - 45);
    const theta = THREE.MathUtils.degToRad(180);
    const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    skyUniforms['sunPosition'].value.copy(sunPosition);

    // Atmosphere (Fog)
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.015);
  }
}