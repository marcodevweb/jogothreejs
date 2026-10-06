import * as THREE from "three";

export class TestSamplerMaterial extends THREE.ShaderMaterial {
  constructor(texture: THREE.Texture) {
    super({
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp sampler3D;
        uniform sampler3D testTexture;
        void main() {
          vec4 color = texture(testTexture, vec3(0.5, 0.5, 0.5));
          gl_FragColor = color;
        }
      `,
      uniforms: {
        testTexture: { value: texture },
      },
      transparent: false,
    });
    this.name = "TestSamplerMaterial";
  }
}
