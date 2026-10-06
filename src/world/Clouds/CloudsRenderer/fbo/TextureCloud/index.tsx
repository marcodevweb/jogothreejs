import * as THREE from "three";
import { CloudsRenderer } from "../index";

// ... (code above)

export class TextureCloud extends THREE.WebGLRenderTarget {
  name: string;

  constructor(width: number, height: number) {
    super(width, height, {
      stencilBuffer: false,
      depthBuffer: true,
    });

    this.texture.format = THREE.RGBAFormat;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.name = "TextureCloud";
  }

  // Add a debug method to log inspector info
  logDetails() {
    console.log("--- TextureCloud Inspector ---");
    console.log("Width:", this.width);
    console.log("Height:", this.height);
    console.log("Texture:", this.texture);
    console.log("Format:", this.texture.format);
    console.log("Type:", this.texture.type);
    console.log("MinFilter:", this.texture.minFilter);
    console.log("MagFilter:", this.texture.magFilter);
    console.log("ColorSpace:", this.texture.colorSpace);
    console.log("DepthBuffer:", this.depthBuffer);
    console.log("StencilBuffer:", this.stencilBuffer);
    console.log("------------------------------");
  }
}
