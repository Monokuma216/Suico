import { type AbstractMesh, FreeCamera, HavokPlugin, HemisphericLight, MeshBuilder, PhysicsAggregate, PhysicsShapeType, type Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';

export function createPlayArea(width: number, height: number) {
  const ground = MeshBuilder.CreateGround('ground', { width, height: 6 });
  const walls: AbstractMesh[] = [];
  const invisibleMaterial = new StandardMaterial('invisibleMaterial');
  invisibleMaterial.alpha = 0;

  for (let i = 0; i < 2; i++) {
    const wallHorizontal = MeshBuilder.CreateBox('wall', { width: 0.1, depth: 6, height });
    wallHorizontal.position = new Vector3(i * width - width / 2, height / 2, 0);
    const wallVertical = MeshBuilder.CreateBox('wall', { width: 6, depth: 0.1, height });
    wallVertical.position = new Vector3(0, height / 2, i * 6 - 3);
    // wallHorizontal.material = invisibleMaterial;
    wallVertical.material = invisibleMaterial;
    walls.push(wallHorizontal, wallVertical);
  }

  new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0 });
  for (const wall of walls) {
    new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0 });
  }

  return { ground, walls };
}

export function createCamera(cameraHeight = 10, isCanControl = false) {
  const camera = new FreeCamera('camera1', new Vector3(0, cameraHeight, -50));
  camera.setTarget(new Vector3(0, cameraHeight, 0));

  if (isCanControl) {
    camera.attachControl(0, true);
  }

  return camera;
}

export function createLight(): void {
  const light = new HemisphericLight('light', new Vector3(0, 1, 0));
  light.intensity = 0.7;
}

export async function createPhysics(scene: Scene, gravity = 10): Promise<HavokPlugin> {
  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -gravity, 0), havokPlugin);
  return havokPlugin;
}
