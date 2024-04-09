import { FreeCamera, HemisphericLight, MeshBuilder, type Scene, Vector3 } from '@babylonjs/core';

export const MainScene = (scene: Scene) => {
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);
  box.position.y = 1;

  MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
};
