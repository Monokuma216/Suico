import { StandardMaterial } from '@babylonjs/core';

let invisibleMaterialInGame: StandardMaterial | undefined;

function getInvisibleMaterial() {
  if (invisibleMaterialInGame) {
    return invisibleMaterialInGame;
  }

  const invisibleMaterial = new StandardMaterial('invisibleMaterial');
  invisibleMaterial.alpha = 0;
  invisibleMaterialInGame = invisibleMaterial;
  return invisibleMaterial;
}

export {
  getInvisibleMaterial,
};
