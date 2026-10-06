import { SceneManager } from './scene/SceneManager.js';

const app =
  document.getElementById('app');

const sceneManager =
  new SceneManager(app);

function animate() {
  requestAnimationFrame(animate);

  sceneManager.update();
}

animate();

window.addEventListener(
  'resize',
  () => {
    sceneManager.onResize();
  }
);