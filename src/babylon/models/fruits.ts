import { Color3, type Vector3 } from '@babylonjs/core';
import logger from '../../loggers';
import { type FruitsList } from '../interfaces';
import { Fruit } from './fruit';

export class Fruits {
  public static fruitsList: FruitsList = {
    apple: { size: 1, color: new Color3(0.5, 0.93, 0.07), nextFruit: 'banana' },
    banana: { size: 2, color: new Color3(0.75, 0.75, 0), nextFruit: 'grapefruit' },
    grapefruit: { size: 3, color: new Color3(0.93, 0.5, 0.07), nextFruit: 'kiwi' },
    kiwi: { size: 4, color: new Color3(1, 0.25, 0.25), nextFruit: 'lemon' },
    lemon: { size: 5, color: new Color3(0.93, 0.07, 0.5), nextFruit: 'lychee' },
    lychee: { size: 6, color: new Color3(0.75, 0, 0.75), nextFruit: 'mandarin' },
    mandarin: { size: 7, color: new Color3(0.5, 0.07, 0.93), nextFruit: 'mango' },
    mango: { size: 8, color: new Color3(0.25, 0.25, 1), nextFruit: 'orange' },
    orange: { size: 9, color: new Color3(0.07, 0.5, 0.93), nextFruit: 'peach' },
    peach: { size: 10, color: new Color3(0, 0.75, 0.75), nextFruit: 'pear' },
    pear: { size: 11, color: new Color3(0.07, 0.93, 0.5), nextFruit: 'pineapple' },
    pineapple: { size: 12, color: new Color3(0.25, 1, 0.25) },
  };

  public static createdFruits: Fruit[] = [];

  static create(name: keyof FruitsList, position: Vector3) {
    const fruit = Fruits.fruitsList[name];
    if (fruit === undefined) {
      logger.warn('Попытка создать фрукт, которого нет в списке');
      return;
    }

    const { size, color } = fruit;
    const newFruit = new Fruit(name, size, color, position);
    Fruits.createdFruits.push(newFruit);
    return newFruit;
  }

  static getNextFruit(name: keyof FruitsList) {
    return Fruits.fruitsList[name].nextFruit;
  }
}
