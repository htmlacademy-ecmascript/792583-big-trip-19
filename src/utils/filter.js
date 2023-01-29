import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const isStartDateExpired = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const isEndDateExpired = (dateTo) => dayjs(dateTo).isAfter(dayjs());

const isFutureEvent = (point) => isStartDateExpired(point.dateFrom) && isEndDateExpired(point.dateTo);

const isPresentEvent = (point) => !isStartDateExpired(point.dateFrom) && isEndDateExpired(point.dateTo);

const isPastEvent = (point) => !isStartDateExpired(point.dateFrom) && !isEndDateExpired(point.dateTo);


const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFutureEvent),
  [FilterType.PRESENT]: (points) => points.filter(isPresentEvent),
  [FilterType.PAST]: (points) => points.filter(isPastEvent),
};

const filterPoints = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((point) => isFutureEvent(point.dateFrom, point.dateTo));
    case FilterType.PRESENT:
      return points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo));
    case FilterType.PAST:
      return points.filter((point) => isPastEvent(point.dateFrom, point.dateTo));
    default:
      return points;
  }
};

export { filter, filterPoints };
