export class HUD {
  constructor() {
    this.element =
      document.createElement('div');

    this.element.style.position =
      'absolute';

    this.element.style.bottom =
      '20px';

    this.element.style.left =
      '20px';

    this.element.style.color =
      'white';

    this.element.style.padding =
      '12px 16px';

    this.element.style.background =
      'rgba(0, 0, 0, 0.55)';

    this.element.style.borderRadius =
      '8px';

    this.element.style.fontFamily =
      'Arial, sans-serif';

    this.element.style.fontSize =
      '15px';

    this.element.style.lineHeight =
      '1.5';

    this.element.style.pointerEvents =
      'none';

    this.element.style.zIndex =
      '500';

    this.element.innerHTML = `
      <strong>CONTROLES</strong><br>
      W A S D — Mover<br>
      SHIFT — Correr<br>
      MOUSE — Câmera<br>
      SCROLL — Zoom
    `;

    document.body.appendChild(
      this.element
    );

    console.log(
      '[HUD] Criada'
    );
  }
}