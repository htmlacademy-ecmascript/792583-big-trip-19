// import ListFilterView from './view/list-filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
// import { generateFilter } from './mock/filter.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventBtnView from './view/btn-new-event-view.js';

// const filters = [
//   {
//     type: 'everything',
//     name: 'EVERYTHING',
//     count: 0,
//   },
// ];

// const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');
const siteMainElement = document.querySelector('.trip-main');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  listContainer: mainEventsElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewEventBtnView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createTask();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, siteMainElement);
// render(new ListFilterView({
//   filters,
//   currentFilterType: 'evetything',
//   onFilterChange: () => { }
// }), headerFiltersElement);

filterPresenter.init();
tripPresenter.init();
