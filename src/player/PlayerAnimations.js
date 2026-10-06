import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class PlayerAnimations {

    constructor(model) {
        this.model = model;
        this.model.visible = false; // Mantém o player invisível por trás do loading

        this.mixer = new THREE.AnimationMixer(this.model);
        this.loader = new FBXLoader();

        this.actions = {};
        this.currentAction = null;
        this.currentState = null;

        // Cria a tela de carregamento visualmente na tela
        this.createLoadingScreen();

        this.loadAnimations();
    }

    createLoadingScreen() {
        this.loadingDiv = document.createElement('div');
        this.loadingDiv.id = 'game-loading-screen';
        this.loadingDiv.style.position = 'fixed';
        this.loadingDiv.style.top = '0';
        this.loadingDiv.style.left = '0';
        this.loadingDiv.style.width = '100vw';
        this.loadingDiv.style.height = '100vh';
        this.loadingDiv.style.backgroundColor = '#0b0f19';
        this.loadingDiv.style.color = '#ffffff';
        this.loadingDiv.style.display = 'flex';
        this.loadingDiv.style.flexDirection = 'column';
        this.loadingDiv.style.justifyContent = 'center';
        this.loadingDiv.style.alignItems = 'center';
        this.loadingDiv.style.zIndex = '99999';
        this.loadingDiv.style.fontFamily = 'Arial, sans-serif';
        this.loadingDiv.innerHTML = `
            <div style="text-align: center;">
                <h2 style="margin-bottom: 15px; font-size: 24px; letter-spacing: 2px;">CARREGANDO JOGO...</h2>
                <p style="color: #00ffcc; font-size: 14px;">Preparando mundo e personagem</p>
            </div>
        `;
        document.body.appendChild(this.loadingDiv);
    }

    removeLoadingScreen() {
        if (this.loadingDiv) {
            this.loadingDiv.style.transition = 'opacity 0.6s ease';
            this.loadingDiv.style.opacity = '0';
            setTimeout(() => {
                this.loadingDiv.remove();
            }, 600);
        }
    }

    loadAnimations() {
        console.log('[ANIMATION] Carregando animações...');

        const animationsToLoad = {
            'IDLE': '/personagens/Neutral Idle.fbx',
            'WALK': '/personagens/Walking.fbx',
            'RUN': '/personagens/Running.fbx'
        };

        let loadedCount = 0;
        const totalAnimations = Object.keys(animationsToLoad).length;

        for (const [state, url] of Object.entries(animationsToLoad)) {
            this.loader.load(url, (fbx) => {
                if (!fbx.animations || fbx.animations.length === 0) {
                    console.error(`[ANIMATION] ${state} não possui animação`);
                    return;
                }

                const clip = fbx.animations[0];
                
                // Remove translação de posição da raiz para evitar conflito com o controlador
                clip.tracks = clip.tracks.filter(track => {
                    return !track.name.includes('.position');
                });

                const action = this.mixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat, Infinity);
                this.actions[state] = action;

                loadedCount++;
                if (loadedCount === totalAnimations) {
                    console.log('[ANIMATION] Todas as animações carregadas');
                    this.playAnimation('IDLE');
                    this.model.visible = true;
                    
                    // Remove a tela de carregamento com transição suave
                    this.removeLoadingScreen();
                }
            });
        }
    }

    playAnimation(state) {
        if (this.currentState === state) return;

        const nextAction = this.actions[state];
        if (!nextAction) return;

        nextAction.enabled = true;
        nextAction.setEffectiveTimeScale(1);
        nextAction.setEffectiveWeight(1);

        if (this.currentAction) {
            nextAction.time = 0;
            nextAction.play();
            nextAction.crossFadeFrom(this.currentAction, 0.2, true);
        } else {
            nextAction.play();
        }

        this.currentAction = nextAction;
        this.currentState = state;
    }

    update(delta) {
        this.mixer.update(delta);
    }
}