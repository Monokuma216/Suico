import { PointerEventTypes, type Scene, Vector3 } from '@babylonjs/core';
import { type FruitsList } from '../interfaces';
import { type Fruit } from '../models/fruit';
import { fruitsUtility } from '../utils/fruits';

export class Spawner {
  scene: Scene;

  curFruit: Fruit;
  spawnedFruits: Fruit[] = [];
  nextFruitName: keyof FruitsList;

  constructor(scene: Scene) {
    this.scene = scene;
    this.nextFruitName = this.getNextFruit().name;
    this.curFruit = fruitsUtility.create(this.nextFruitName);
    this.curFruit.createModel(new Vector3(0, 20, 0));

    let isMouseDown = false;
    scene.onPointerObservable.add((eventData) => {
      if (eventData.type === PointerEventTypes.POINTERTAP) {
        const position = this.curFruit.mesh?.position.clone();
        if (!position) return;

        this.spawnFruit(this.curFruit);
        this.nextFruitName = this.getNextFruit().name;
        this.curFruit = fruitsUtility.create(this.nextFruitName);
        this.curFruit.createModel(position);
        return;
      }

      if (eventData.type === PointerEventTypes.POINTERDOWN) {
        isMouseDown = true;
      } else if (eventData.type === PointerEventTypes.POINTERUP) {
        isMouseDown = false;
      }

      if (!isMouseDown) return;

      if (eventData.type === PointerEventTypes.POINTERMOVE) {
        const isHit = eventData.pickInfo?.hit;
        if (!isHit) return;

        const position = eventData.pickInfo?.pickedPoint;
        if (!position) return;

        const mesh = this.curFruit.mesh;
        if (!mesh) return;

        mesh.position.x = position.x;
      }
    });
  }

  getNextFruit() {
    const availableCountFruits = 3;
    const allFruit = fruitsUtility.getFruitList();
    allFruit.length = availableCountFruits;
    return allFruit[Math.floor(Math.random() * allFruit.length)];
  }

  spawnFruit(fruit: Fruit) {
    if (!fruit.mesh) return;
    fruit.createPhysics(fruit.mesh.position);
    this.spawnedFruits.push(fruit);
  }
}
