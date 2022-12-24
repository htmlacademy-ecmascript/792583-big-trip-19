import dayjs from 'dayjs';

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

export {
  humanizeTaskDueDate,
  isTaskExpired,
  isTaskExpiringToday,
};
