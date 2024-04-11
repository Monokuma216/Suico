import { type Scene, Vector3 } from '@babylonjs/core';
import logger from '../../loggers/index';
import { type Fruit } from '../models/fruit';
import { Fruits } from '../models/fruits';
import { merging } from '../utils/merging';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { createCamera, createLight, createPhysics, createPlayArea } from './enviroment';

export const MainScene = async (scene: Scene) => {
  createCamera(10, false);
  createLight();
  const havokPlugin = await createPhysics(scene);
  createPlayArea(20, 20);

  await scene.debugLayer.show({ embedMode: true, overlay: true });

  Fruits.create('apple', new Vector3(0, 2, 0));
  Fruits.create('apple', new Vector3(0, 8, 0));

  const fruits: Fruit[] = [];

  havokPlugin.onCollisionObservable.add((event) => {
    if (event.type === 'COLLISION_STARTED') {
      if (event.collider.transformNode.uniqueId === event.collidedAgainst.transformNode.uniqueId) { return; }
      const colliderSize = event.collider.transformNode.metadata?.size as number | undefined;
      const collidedAgainstSize = event.collidedAgainst.transformNode.metadata?.size as number | undefined;
      if (!colliderSize || !collidedAgainstSize) { return; }
      if (colliderSize !== collidedAgainstSize) { return; }
      logger.info({ collider: event.collider, collidedAgainst: event.collidedAgainst });
      const newFruit = merging(event.collider.transformNode, event.collidedAgainst.transformNode);
      if (newFruit) fruits.push(newFruit);
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
