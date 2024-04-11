import { MeshBuilder, PointerEventTypes, type Scene, Vector3 } from '@babylonjs/core';
import { Fruits } from '../models/fruits';

export class Spawner {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;

    const disc = MeshBuilder.CreateDisc('disc');
    disc.position.y = 20;

    let isMouseDown = false;
    scene.onPointerObservable.add((eventData) => {
      if (eventData.type === PointerEventTypes.POINTERDOWN) {
        isMouseDown = true;
      } else if (eventData.type === PointerEventTypes.POINTERUP) {
        isMouseDown = false;
        Fruits.create('apple', new Vector3(disc.position.x, 20, 0));
      }

      if (!isMouseDown) return;

      if (eventData.type === PointerEventTypes.POINTERMOVE) {
        const isHit = eventData.pickInfo?.hit;
        if (!isHit) return;

        const position = eventData.pickInfo?.pickedPoint;
        if (!position) return;

        disc.position.x = position.x;
      }
    });
  }
}
