import dayjs from 'dayjs';
import { FilterType, SortType } from '../const.js';

const isStartDateExpired = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const isEndDateExpired = (dateTo) => dayjs(dateTo).isAfter(dayjs());

const isFutureEvent = (dateFrom, dateTo) => isStartDateExpired(dateFrom) && isEndDateExpired(dateTo);

const isPresentEvent = (dateFrom, dateTo) => !isStartDateExpired(dateFrom) && isEndDateExpired(dateTo);

const isPastEvent = (dateFrom, dateTo) => !isStartDateExpired(dateFrom) && !isEndDateExpired(dateTo);

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom, point.dateTo)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastEvent(point.dateFrom, point.dateTo)),
};

const sort = {
  [SortType.DAY]: (points) => points.sort((from, to) => dayjs(from.dateFrom).diff(dayjs(to.dateFrom))),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points,
  [SortType.PRICE]: (points) => points.sort((from, to) => to.basePrice - from.basePrice),
  [SortType.OFFERS]: (points) => points,
};

export { filter, sort };
