import { type Color3, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial, type TransformNode, Vector3 } from '@babylonjs/core';

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
    material.emissiveColor = color;

    const disc = MeshBuilder.CreateDisc(this.name, { tessellation: 20 });
    disc.metadata = { name: this.name, size: this.size };
    disc.material = material;
    disc.position = position;
    disc.scaling = Vector3.One().scale(this.size);

    this.mesh = disc;
    this.physicsAggregate = new PhysicsAggregate(disc, PhysicsShapeType.CYLINDER, {
      mass: this.size,
      restitution: 0.5,
      friction: 0.1,
      pointA: new Vector3(0, 0, -0.5),
      pointB: new Vector3(0, 0, 0.5),
    });
    this.physicsAggregate.body.setCollisionCallbackEnabled(true);

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
