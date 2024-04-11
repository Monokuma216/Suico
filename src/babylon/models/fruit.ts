import { type Color3, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial, type TransformNode, Vector3 } from '@babylonjs/core';
import logger from '../../loggers';

export class Fruit {
  name: string;
  size: number;

  isDisposed = false;
  physicsAggregate!: PhysicsAggregate;
  mesh!: TransformNode;

  constructor(name: string, size: number, color: Color3, position: Vector3) {
    this.name = name;
    this.size = size;
    this.create(color, position);
  }

  create(color: Color3, position: Vector3) {
    const material = new StandardMaterial(`${this.name}Material`);
    material.diffuseColor = color;

    const disc = MeshBuilder.CreateDisc(this.name, { tessellation: 17 });
    disc.metadata = { name: this.name, size: this.size };
    disc.material = material;
    disc.position = position;
    disc.scaling = Vector3.One().scale(this.size);

    this.mesh = disc;
    this.physicsAggregate = new PhysicsAggregate(disc, PhysicsShapeType.MESH, { mass: this.size, restitution: 0.3 });
    this.physicsAggregate.body.setCollisionCallbackEnabled(true);

    logger.info({ msg: 'Фрукт создан', fruit: this.name, id: disc.uniqueId });
    return disc;
  }

  dispose() {
    if (!this.isDisposed) {
      this.mesh.dispose();
      this.physicsAggregate.dispose();
      this.isDisposed = true;
    }
  }
}
