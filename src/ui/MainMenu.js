export class Menu {
  constructor(container, onStart) {
    this.container = container;
    this.onStart = onStart;

    this.element =
      document.createElement('div');

    this.element.style.position =
      'absolute';

    this.element.style.top = '0';
    this.element.style.left = '0';

    this.element.style.width =
      '100vw';

    this.element.style.height =
      '100vh';

    this.element.style.display =
      'flex';

    this.element.style.flexDirection =
      'column';

    this.element.style.justifyContent =
      'center';

    this.element.style.alignItems =
      'center';

    this.element.style.background =
      'linear-gradient(' +
      'rgba(0,0,0,0.15),' +
      'rgba(0,0,0,0.65)' +
      ')';

    this.element.style.color =
      'white';

    this.element.style.zIndex =
      '1000';

    this.element.style.fontFamily =
      'Arial, sans-serif';

    this.element.style.pointerEvents =
      'auto';

    this.element.innerHTML = `
      <div style="
        text-align:center;
        user-select:none;
      ">

        <div style="
          font-size:64px;
          font-weight:800;
          letter-spacing:6px;
          text-shadow:
            0 4px 20px rgba(0,0,0,0.8);
          margin-bottom:40px;
        ">
          ISLAND
        </div>

        <button
          id="start-btn"
          style="
            padding:18px 55px;
            font-size:24px;
            font-weight:bold;
            letter-spacing:2px;
            color:white;
            background:rgba(20,20,20,0.75);
            border:2px solid rgba(255,255,255,0.8);
            border-radius:8px;
            cursor:pointer;
            transition:
              transform 0.15s ease,
              background 0.15s ease;
          "
        >
          START GAME
        </button>

      </div>
    `;

    container.appendChild(
      this.element
    );

    this.startButton =
      this.element.querySelector(
        '#start-btn'
      );

    if (!this.startButton) {
      console.error(
        '[MENU] START GAME não encontrado'
      );

      return;
    }

    console.log(
      '[MENU] START GAME encontrado'
    );

    this.startButton.addEventListener(
      'mouseenter',
      () => {
        this.startButton.style.transform =
          'scale(1.06)';

        this.startButton.style.background =
          'rgba(255,255,255,0.2)';
      }
    );

    this.startButton.addEventListener(
      'mouseleave',
      () => {
        this.startButton.style.transform =
          'scale(1)';

        this.startButton.style.background =
          'rgba(20,20,20,0.75)';
      }
    );

    this.startButton.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log(
          '[MENU] START GAME clicado'
        );

        this.hide();

        if (this.onStart) {
          this.onStart();
        }
      }
    );

    console.log(
      '[MENU] Menu criado'
    );
  }

  hide() {
    this.element.style.display =
      'none';

    this.element.style.pointerEvents =
      'none';

    console.log(
      '[MENU] Menu ocultado'
    );
  }

  show() {
    this.element.style.display =
      'flex';

    this.element.style.pointerEvents =
      'auto';
  }
}