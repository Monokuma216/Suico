import { type Color3 } from '@babylonjs/core';

interface IFruit {
  size: number;
  color: Color3;
  nextFruit?: keyof FruitsList;
}

export interface FruitsList {
  apple: IFruit;
  banana: IFruit;
  grapefruit: IFruit;
  kiwi: IFruit;
  lemon: IFruit;
  lychee: IFruit;
  mandarin: IFruit;
  mango: IFruit;
  orange: IFruit;
  peach: IFruit;
  pear: IFruit;
  pineapple: IFruit;
}
