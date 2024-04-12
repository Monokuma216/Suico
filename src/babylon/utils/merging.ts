import { type TransformNode, Vector3 } from '@babylonjs/core';
import { type FruitsList } from '../interfaces';
import { fruitsUtility } from './fruits';

export function merging(a: TransformNode, b: TransformNode) {
  const name: keyof FruitsList | undefined = a.metadata.name;
  if (name === undefined) return;
  const nextFruit = fruitsUtility.getNextFruit(name);
  if (nextFruit === undefined) return;

  const middlePosition = new Vector3((a.position.x + b.position.x) / 2, (a.position.y + b.position.y) / 2, (a.position.z + b.position.z) / 2);

  const fruit = fruitsUtility.create(nextFruit);
  fruit.createPhysics(middlePosition);
  return fruit;
}
