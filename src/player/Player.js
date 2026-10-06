import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PlayerAnimations } from './PlayerAnimations.js';
import { PlayerController } from './PlayerController.js';

export class Player {

    constructor(scene, camera, terrain = null, cameraControls = null) {

        this.scene = scene;
        this.camera = camera;
        this.cameraControls = cameraControls;
        this.terrain = terrain;

        this.loader = new FBXLoader();

        this.model = null;
        this.animations = null;
        this.controller = null;

        this.loadModel();
    }


    loadModel() {
        console.log('[PLAYER] Carregando personagem...');
        this.loader.load(
            '/personagens/Ch31_nonPBR.fbx',
            (fbx) => {
                console.log('[PLAYER] PERSONAGEM CARREGADO');
                this.model = fbx;

                // --- ROOT MOTION FIX ---
                // Verifica se há animações no objeto raiz (fbx).
                // Às vezes, o FBX contém animações no próprio modelo root que movem a posição.
                // Criamos um container para separar a animação da lógica de movimentação do jogador.
                this.model.traverse((object) => {
                    if (object.isMesh || object.isSkinnedMesh) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });

                // Limpa animações do root, se houver, para evitar "puxada" de posição
                this.model.animations = [];

                this.model.scale.set(0.01, 0.01, 0.01);
                this.model.position.set(0, 0, 0);

                // --- CLAMP BoundingBox ---
                this.model.updateMatrixWorld();
                const box = new THREE.Box3().setFromObject(this.model);
                const offset = box.min.y - this.model.position.y;
                const terrainY = this.terrain.getHeightAt(
                    this.model.position.x,
                    this.model.position.z
                );
                this.model.position.y = terrainY - offset;

                this.scene.add(this.model);

                // --- ANIMAÇÕES ---
                this.animations = new PlayerAnimations(this.model);

                // --- CONTROLE ---
                this.controller = new PlayerController(this, this.cameraControls || this.camera);
            },
            null,
            (error) => { console.error('[PLAYER] ERRO AO CARREGAR:', error); }
        );
    }

    updateAnimationsOnly(delta) {

        if (this.animations) {

            this.animations.update(delta);

        }

    }


    updateControllerOnly(delta) {

        if (this.controller) {

            this.controller.update(delta);

        }

    }


    update(delta) {

        this.updateAnimationsOnly(delta);

        this.updateControllerOnly(delta);

    }

}