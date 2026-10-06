import { TestMaterial } from "./materials/TestMaterial";
import { TestSamplerMaterial } from "./materials/TestSamplerMaterial";
import { Size } from "@react-three/fiber";
import * as THREE from "three";
import { TextureA3D } from "./fbo/TextureA3D";
import { TextureA3DMaterial } from "./fbo/TextureA3D/TextureA3DMaterial";
import { TextureB3D } from "./fbo/TextureB3D";
import { TextureB3DMaterial } from "./fbo/TextureB3D/TextureB3DMaterial";
import { TextureC2D } from "./fbo/TextureC3D";
import { TextureC2DMaterial } from "./fbo/TextureC3D/TextureB3DMaterial";
import { TextureCloud } from "./fbo/TextureCloud";
import { TextureEnvelope } from "./fbo/TextureEnvelope";
import { TextureEnvelopeMaterial } from "./fbo/TextureEnvelope/TextureEnvelopeMaterial";
import { TextureScene } from "./fbo/TextureScene";
import { FullScreenQuad } from "./FullScreenQuad";
import { CloudMaterial } from "./materials/CloudMaterial";
import { RenderMaterial } from "./materials/RenderMaterial";

export class CloudsRenderer {
  _gl: THREE.WebGLRenderer;

  textureA3DMaterial: TextureA3DMaterial;
  textureA3D: TextureA3D;

  textureB3DMaterial: TextureB3DMaterial;
  textureB3D: TextureB3D;

  textureC2DMaterial: TextureC2DMaterial;
  textureC2D: TextureC2D;

  textureEnvelopeMaterial: TextureEnvelopeMaterial;
  textureEnvelope: TextureEnvelope;

  textureScene: TextureScene;
  textureCloud: TextureCloud;

  renderMaterial: RenderMaterial;
  cloudMaterial: CloudMaterial;
  testMaterial: TestMaterial;
  testSamplerMaterial: TestSamplerMaterial;

  fsQuad: FullScreenQuad;

  constructor(gl: THREE.WebGLRenderer, size: Size) {
    this._gl = gl;

    const downSampleFactor = 0.5;

    this.textureA3D = new TextureA3D(128, 128, 128);
    this.textureB3D = new TextureB3D(32, 32, 32);
    this.textureC2D = new TextureC2D(128, 128);
    this.textureEnvelope = new TextureEnvelope(256, 256);

    this.textureScene = new TextureScene(
      size.width * downSampleFactor,
      size.height * downSampleFactor
    );

    this.textureCloud = new TextureCloud(
      size.width * downSampleFactor,
      size.height * downSampleFactor
    );

    // Call diagnostic log
    this.textureCloud.logDetails();

    this.fsQuad = new FullScreenQuad();

    this.textureA3DMaterial = new TextureA3DMaterial();
    this.textureB3DMaterial = new TextureB3DMaterial();
    this.textureC2DMaterial = new TextureC2DMaterial();
    this.textureEnvelopeMaterial = new TextureEnvelopeMaterial();
    this.renderMaterial = new RenderMaterial(this);
    this.cloudMaterial = new CloudMaterial(this);
    this.testMaterial = new TestMaterial();
    this.testSamplerMaterial = new TestSamplerMaterial(this.textureA3D.texture);

    this.generate3DTextures(this.textureA3DMaterial, this.textureA3D);
    this.generate3DTextures(this.textureB3DMaterial, this.textureB3D);
    this.generate2DTextures(this.textureC2DMaterial, this.textureC2D);
    this.generate2DTextures(this.textureEnvelopeMaterial, this.textureEnvelope);
  }

  get textures(): (THREE.WebGLRenderTarget | THREE.WebGL3DRenderTarget)[] {
    return [
      this.textureEnvelope,
      this.textureA3D,
      this.textureB3D,
      this.textureC2D,
    ];
  }

  generate2DTextures(material: THREE.Material, fbo: THREE.WebGLRenderTarget) {
    this.fsQuad.material = material;
    this._gl.setRenderTarget(fbo);
    this.fsQuad.render(this._gl);
    this._gl.setRenderTarget(null);
  }

  generate3DTextures(material: THREE.Material, fbo: THREE.WebGL3DRenderTarget) {
    const d = fbo.depth;

    this.fsQuad.material = material;

    for (let i = 0; i < d; i++) {
      const normalizedDepth = i / d;
      // @ts-ignore
      material.zCoord = normalizedDepth;

      this._gl.setRenderTarget(fbo, i);
      this.fsQuad.render(this._gl);
    }

    this._gl.setRenderTarget(null);
  }

  resize(size: Size) {
    this.textureScene.setSize(size.width, size.height);
    this.textureCloud.setSize(size.width, size.height);
  }

  render(
    dt: number,
    target: THREE.Mesh,
    camera: THREE.Camera,
    scene: THREE.Scene
  ) {
    const gl = this._gl as any;
    const renderer = this._gl as any;

    console.log("=== MINIMAL RED TEST START ===");
    console.log("WebGL Version:", gl.getParameter(gl.VERSION));
    console.log("Shading Language Version:", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    console.log("Is WebGL2:", gl instanceof WebGL2RenderingContext);
    console.log("Max 3D Texture Size:", gl.getParameter(gl.MAX_3D_TEXTURE_SIZE));

    // --- RED TEST ---
    this._gl.setRenderTarget(null);
    this._gl.setViewport(0, 0, this._gl.domElement.width, this._gl.domElement.height);
    this._gl.clear();
    this.fsQuad.material = this.testMaterial;

    this.fsQuad.render(this._gl);

    // Captura logs do programa após render
    const p = (this.fsQuad.material as any).program;
    if (p) {
        console.log("Vertex compile:", gl.getShaderParameter(p.vertexShader, gl.COMPILE_STATUS));
        console.log("Vertex log:", gl.getShaderInfoLog(p.vertexShader));
        console.log("Fragment compile:", gl.getShaderParameter(p.fragmentShader, gl.COMPILE_STATUS));
        console.log("Fragment log:", gl.getShaderInfoLog(p.fragmentShader));
        console.log("Program link:", gl.getProgramParameter(p.program, gl.LINK_STATUS));
        console.log("Program log:", gl.getProgramInfoLog(p.program));
    }
    console.log("GL ERROR:", gl.getError());
    console.log("=== MINIMAL RED TEST END ===");

  }
}
