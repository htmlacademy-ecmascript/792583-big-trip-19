import dayjs from 'dayjs';
import { SortType } from '../const.js';
import { PRICE_PATTERN } from '../const.js';

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

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type).offers;

const getSelectedDestination = (destinations, destinationId) => destinations.find((item) => item.id === destinationId);

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);

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

const sortPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.DAY:
      return points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));
    case SortType.EVENT:
      return points.sort((pointA, pointB) => dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom)));
    case SortType.TIME:
      return points.sort((pointA, pointB) =>
        dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom));
    case SortType.OFFERS:
      return points.sort((pointA, pointB) => pointB.offers.length - pointA.offers.length);
    case SortType.PRICE:
      return points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
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

const priceValidation = (value) => {

  let currentValue = value.replace(PRICE_PATTERN, '');

  if (currentValue < 0) {
    currentValue = Math.abs(currentValue);
  }
  currentValue = +currentValue;
  return currentValue;
};

export {
  humanizeTaskDueDate,
  isTaskExpired,
  isTaskExpiringToday,
  getWeightForNullDate,
  sortPoints,
  sort,
  getOffersByType,
  getSelectedDestination,
  getSelectedOffers,
  isOfferIsSelected,
  priceValidation,
};
