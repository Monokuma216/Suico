import { type AbstractMesh, ActionManager, FreeCamera, HavokPlugin, HemisphericLight, MeshBuilder, PhysicsAggregate, PhysicsShapeType, type Scene, Vector3 } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { getInvisibleMaterial } from '../../utils/materials';

export function createPlayArea(width: number, height: number) {
  const depth: number = 1.2;
  const ground = MeshBuilder.CreateGround('ground', { width, height: depth });
  const walls: AbstractMesh[] = [];

  for (let i = 0; i < 2; i++) {
    const wallHorizontal = MeshBuilder.CreateBox('wall', { width: 0.1, depth, height });
    wallHorizontal.position = new Vector3(i * width - width / 2, height / 2, 0);
    const wallVertical = MeshBuilder.CreateBox('wall', { width, depth: 0.1, height });
    wallVertical.position = new Vector3(0, height / 2, i * depth - depth / 2);
    wallVertical.material = getInvisibleMaterial();
    walls.push(wallHorizontal, wallVertical);
  }

  new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.1 });
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

export function createTriggerPlane(width: number, height: number): void {
  const plane = MeshBuilder.CreatePlane('plane', { width, height });
  plane.position.y = height / 2;
  plane.isPickable = true;
  plane.actionManager = new ActionManager();
  plane.material = getInvisibleMaterial();
}
