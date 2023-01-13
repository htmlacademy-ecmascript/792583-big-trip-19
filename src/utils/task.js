import dayjs from 'dayjs';
import { SortType } from '../const.js';

const DATE_FORMAT = 'MMM DD';

function humanizeTaskDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function isTaskExpired(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isTaskExpiringToday(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortPointUp(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointA.dueDate).diff(dayjs(pointB.dueDate));
}

function sortPointDown(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointB.dueDate).diff(dayjs(pointA.dueDate));
}

const sortPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.DAY:
      return points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));
    case SortType.TIME:
      return points.sort((pointA, pointB) =>
        dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom));
    case SortType.OFFERS:
      return points.sort((pointA, pointB) => pointA.offers.length - pointB.offers.length);
    case SortType.PRICE:
      return points.sort((pointA, pointB) => pointA.basePrice - pointB.basePrice);
    default:
      return points;
  }
};

const sort = {
  [SortType.DAY]: (points) => points.sort((from, to) => dayjs(from.dateFrom).diff(dayjs(to.dateFrom))),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points,
  [SortType.PRICE]: (points) => points.sort((from, to) => to.basePrice - from.basePrice),
  [SortType.OFFERS]: (points) => points,
};

export {
  humanizeTaskDueDate,
  isTaskExpired,
  isTaskExpiringToday,
  sortPointDown,
  sortPointUp,
  getWeightForNullDate,
  sortPoints,
  sort
};
