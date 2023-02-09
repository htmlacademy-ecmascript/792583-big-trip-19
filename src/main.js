import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventBtnView from './view/new-event-btn-view.js';
import PointsApiService from './points-api-service.js';
import InfoPresenter from './presenter/info-presenter.js';

const AUTHORIZATION = 'Basic ONcw19vl93ADiv19';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip';

const mainEventsElement = document.querySelector('.trip-events');
const siteMainElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

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

const infoPresenter = new InfoPresenter(siteMainElement, pointsModel);

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

filterPresenter.init();
tripPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteMainElement);
  });
infoPresenter.init();
