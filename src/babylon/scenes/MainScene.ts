import { type AbstractMesh, FreeCamera, HavokPlugin, HemisphericLight, MeshBuilder, PhysicsAggregate, PhysicsShapeType, type Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Debug } from '@babylonjs/core/Legacy/legacy';
import HavokPhysics from '@babylonjs/havok';
import logger from '../../loggers/index';
import { type Fruit } from '../models/fruit';
import { Fruits } from '../models/fruits';
import { merging } from '../utils/merging';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

export const MainScene = async (scene: Scene) => {
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  await scene.debugLayer.show({ embedMode: true, overlay: true });

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -10, 0), havokPlugin);

  Fruits.create('apple', new Vector3(0, 2, 0));
  Fruits.create('apple', new Vector3(0, 8, 0));

  const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
  const walls: AbstractMesh[] = [];
  const invisibleMaterial = new StandardMaterial('invisibleMaterial', scene);
  invisibleMaterial.alpha = 0;

  for (let i = 0; i < 2; i++) {
    const wallHorizontal = MeshBuilder.CreateBox('wall', { width: 0.1, depth: 6, height: 6 }, scene);
    wallHorizontal.position = new Vector3(i * 6 - 3, 3, 0);
    const wallVertical = MeshBuilder.CreateBox('wall', { width: 6, depth: 0.1, height: 6 }, scene);
    wallVertical.position = new Vector3(0, 3, i * 6 - 3);
    wallHorizontal.material = invisibleMaterial;
    wallVertical.material = invisibleMaterial;
    walls.push(wallHorizontal, wallVertical);
  }

  new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0 });
  for (const wall of walls) {
    new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0 });
  }

  const fruits: Fruit[] = [];

  const viewer = new Debug.PhysicsViewer();
  havokPlugin.onCollisionObservable.add((event) => {
    if (event.type === 'COLLISION_STARTED') {
      if (event.collider.transformNode.uniqueId === event.collidedAgainst.transformNode.uniqueId) { return; }
      const colliderSize = event.collider.transformNode.metadata?.size as number | undefined;
      const collidedAgainstSize = event.collidedAgainst.transformNode.metadata?.size as number | undefined;
      if (!colliderSize || !collidedAgainstSize) { return; }
      if (colliderSize !== collidedAgainstSize) { return; }
      logger.info({ collider: event.collider, collidedAgainst: event.collidedAgainst });
      const newFruit = merging(event.collider.transformNode, event.collidedAgainst.transformNode);
      if (newFruit) {
        fruits.push(newFruit);
        viewer.showBody(newFruit.physicsAggregate.body);
      }
      viewer.hideBody(event.collider);
      viewer.hideBody(event.collidedAgainst);
      event.collider.transformNode.dispose();
      event.collidedAgainst.transformNode.dispose();
      event.collider.dispose();
      event.collidedAgainst.dispose();
    }
  });

  scene.onBeforeRenderObservable.add(() => {
    for (const fruit of Fruits.createdFruits) {
      if (fruit.physicsAggregate.body.isDisposed) continue;
      fruit.physicsAggregate.body.setAngularVelocity(new Vector3(0, 0, 0));
      const vel = fruit.physicsAggregate.body.getLinearVelocity();
      fruit.physicsAggregate.body.setLinearVelocity(new Vector3(vel.x, vel.y, 0));
    }
  });
};