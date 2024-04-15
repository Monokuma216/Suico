import { PointerEventTypes, type Scene, setAndStartTimer, Vector3 } from '@babylonjs/core';
import { type FruitsList } from '../interfaces';
import { type Fruit } from '../models/fruit';
import { fruitsUtility } from '../utils/fruits';

export class Spawner {
  scene: Scene;
  isReadySpawn: boolean = true;

  curFruit!: Fruit;
  spawnedFruits: Fruit[] = [];
  nextFruitName!: keyof FruitsList;

  constructor(scene: Scene) {
    this.scene = scene;
    const startPosition: Vector3 = new Vector3(0, 20, 0);
    this.prepareNewFruit(startPosition);

    let isMouseDown = false;
    scene.onPointerObservable.add((eventData) => {
      if (!this.isReadySpawn) return;

      if (eventData.type === PointerEventTypes.POINTERTAP) {
        const position = this.curFruit.mesh?.position.clone();
        if (!position) return;
        position.y = 20;
        position.z = 0;
        this.spawnFruit(this.curFruit);
        this.isReadySpawn = false;

        setAndStartTimer({
          timeout: 1000,
          contextObservable: scene.onBeforeRenderObservable,
          onEnded: () => {
            this.prepareNewFruit(position);
            this.isReadySpawn = true;
          },
        });

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

  private prepareNewFruit(position: Vector3): void {
    this.nextFruitName = this.getNextFruit().name;
    this.curFruit = fruitsUtility.create(this.nextFruitName);
    this.curFruit.createModel(position);
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
