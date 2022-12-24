import { filter, sort } from '../utils/filter.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterName, filterPoints]) => ({
      name: filterName,
      count: filterPoints(points).length,
    })
  );
}

function generateSort(points) {
  return Object.entries(sort).map(
    ([sortName, sortPoints]) => ({
      name: sortName,
      count: sortPoints(points).length,
    })
  );
}

export { generateFilter, generateSort };
