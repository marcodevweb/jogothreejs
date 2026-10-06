import * as THREE from 'three';

export class PlayerController {

    constructor(player, camera) {
        this.player = player;
        this.camera = camera;
        this.keys = {};

        this.walkSpeed = 3.5;
        this.runSpeed = 7.0;

        this.currentState = 'IDLE';

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    update(delta) {
        if (!this.player.model) return;

        const direction = new THREE.Vector3();

        if (this.keys['KeyW']) direction.z -= 1;
        if (this.keys['KeyS']) direction.z += 1;
        if (this.keys['KeyA']) direction.x -= 1;
        if (this.keys['KeyD']) direction.x += 1;

        if (direction.lengthSq() === 0) {
            this.updateState('IDLE');
            return;
        }

        direction.normalize();

        // Câmera relativa
        const cameraYaw = this.camera.getYaw ? this.camera.getYaw() : 0;
        direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

        const running = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
        const speed = running ? this.runSpeed : this.walkSpeed;

        this.updateState(running ? 'RUN' : 'WALK');

        // Movimento
        this.player.model.position.x += direction.x * speed * delta;
        this.player.model.position.z += direction.z * speed * delta;

        // Correção terreno
        const terrain = this.player.terrain;
        if (terrain) {
            const posX = this.player.model.position.x;
            const posZ = this.player.model.position.z;

            const actualY = terrain.getHeightAt(posX, posZ);

            if (isNaN(actualY)) {
                // Se sair do terreno, mantém a última altura válida ou não altera o Y
                console.warn("[PLAYER] Fora dos limites do terreno ou altura inválida!");
            } else {
                if (this.player.feetOffset === undefined) {
                    this.player.model.updateMatrixWorld();
                    const box = new THREE.Box3().setFromObject(this.player.model);
                    this.player.feetOffset = box.min.y - this.player.model.position.y;
                }
                this.player.model.position.y = actualY - this.player.feetOffset;
            }
        }

        // Rotação suave
        const targetAngle = Math.atan2(direction.x, direction.z);
        this.player.model.rotation.y = THREE.MathUtils.damp(
            this.player.model.rotation.y,
            targetAngle,
            10,
            delta
        );
    }

    updateState(state) {
        if (this.currentState !== state) {
            this.currentState = state;
            this.player.animations.playAnimation(state);
        }
    }
}