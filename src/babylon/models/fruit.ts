import { type Color3, type Mesh, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial, type TransformNode, Vector3 } from '@babylonjs/core';
import { type FruitsList } from '../interfaces';
import { fruitsUtility } from '../utils/fruits';

export class Fruit {
  name: keyof FruitsList;
  size: number;
  color: Color3;

  isDisposed = false;
  physicsAggregate?: PhysicsAggregate;
  mesh?: TransformNode;

  constructor(name: keyof FruitsList) {
    const { color, size } = fruitsUtility.getFruitByName(name);

    this.name = name;
    this.size = size;
    this.color = color;
  }

  createPhysics(position: Vector3) {
    const disc = this.mesh ?? this.createModel(position);

    this.physicsAggregate = new PhysicsAggregate(disc, PhysicsShapeType.CYLINDER, {
      mass: this.size, restitution: 0.5, friction: 0.1, pointA: new Vector3(0, 0, -0.5), pointB: new Vector3(0, 0, 0.5),
    });
    this.physicsAggregate.body.setCollisionCallbackEnabled(true);

    return disc;
  }

  createModel(position: Vector3): Mesh {
    const material = new StandardMaterial(`${this.name}Material`);
    material.diffuseColor = this.color;
    material.emissiveColor = this.color;

    const disc = MeshBuilder.CreateDisc(this.name, { tessellation: 20 });
    disc.metadata = { name: this.name, size: this.size };
    disc.material = material;
    disc.position = position;
    disc.scaling = Vector3.One().scale(this.size);
    this.mesh = disc;
    return disc;
  }

  dispose() {
    if (this.isDisposed) return;
    this.mesh?.dispose();
    this.physicsAggregate?.dispose();
    this.isDisposed = true;
  }
}
