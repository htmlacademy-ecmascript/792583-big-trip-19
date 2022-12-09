import TripPresenter from './presenter/trip-presenter.js';

const headerElement = document.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({
  boardContainer: tripEventsElement,
  filterContainer: headerElement,
});

tripPresenter.init();
