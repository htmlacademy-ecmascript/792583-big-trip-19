import dayjs from 'dayjs';
import { require } from 'dayjs';

const HOUR = 1;
const DAY = 24;

const durationDate = (startDate, endDate) => {

  const duration = require('dayjs/plugin/duration');
  dayjs.extend(duration);

  const durationTime = dayjs(endDate).diff(startDate);
  const durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');
  let durationFormat = 'DD[D] HH[H] mm[M]';

  if (durationTimeInHour < HOUR) {
    durationFormat = 'mm[M]';
  }
  if (durationTimeInHour >= HOUR && durationTimeInHour < DAY) {
    durationFormat = 'HH[H] mm[M]';
  }

  return dayjs.duration(durationTime).format(durationFormat);
};

export { durationDate };
