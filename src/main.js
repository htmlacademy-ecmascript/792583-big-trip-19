import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventBtnView from './view/btn-new-event-view.js';

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
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, siteMainElement);

filterPresenter.init();
tripPresenter.init();
