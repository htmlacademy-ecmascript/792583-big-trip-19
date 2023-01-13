import ListFilterView from './view/list-filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './mock/filter.js';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  tripContainer: mainEventsElement,
  pointsModel
});

const filters = generateFilter(pointsModel.points);

render(new ListFilterView({ filters }), headerFiltersElement);

tripPresenter.init();
