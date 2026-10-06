import * as THREE from "three";

export class TestMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
      transparent: false,
    });
    this.name = "TestMaterial";
  }
}
