import { getRandomPoint } from '../mock/mock.js';

const POINTS_COUNT = 4;

export default class PointsModel {
  #points = Array.from({ length: POINTS_COUNT }, getRandomPoint);

  get points() {
    return this.#points;
  }
}
