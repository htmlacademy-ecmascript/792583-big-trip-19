import { filter, sort } from '../utils/filter.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterName, filterPoints]) => ({
      name: filterName,
      count: filterPoints(points).length,
    })
  );
}

function generateSort() {
  return Object.entries(sort).map(
    ([sortName]) => ({
      name: sortName,
    })
  );
}

export { generateFilter, generateSort };
