import TripListView from '../view/trip-list-view.js';
import { render } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import ListSortView from '../view/list-sort-view.js';
import ListFilterView from '../view/list-filter-view.js';
import { FilterType, SortType } from '../const.js';
import { sortPoints } from '../utils/task.js';
import { filterPoints } from '../utils/filter.js';
import { generateFilter } from '../mock/filter.js';


const mainEventsElement = document.querySelector('.trip-events');
const mainTopElement = document.querySelector('.trip-controls');

export default class TripPresenter {
  #pointsModel = null;
  #tripContainer = null;

  #tripListComponent = new TripListView();
  #noPointsComponent = new ListEmptyView();
  #listPoints = [];
  #filteredPoints = [];
  #pointPresenter = new Map();
  #currentFilterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #sourcedListPoints = [];
  #soursedFilterPoints = [];
  #filterComponent = null;
  #sortComponent = null;
  #renderPoint(point) {

    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderNoPoints() {
    render(this.#noPointsComponent, mainEventsElement);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#filteredPoints = updateItem(this.#filteredPoints, updatedPoint);//
    this.#sourcedListPoints = updateItem(this.#sourcedListPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#listPoints = sortPoints(this.#listPoints, SortType.DAY);
        break;
      case SortType.TIME:
        this.#listPoints = sortPoints(this.#listPoints, SortType.TIME);
        break;
      case SortType.PRICE:
        this.#listPoints = sortPoints(this.#listPoints, SortType.PRICE);
        break;
      case SortType.OFFERS:
        this.#listPoints = sortPoints(this.#listPoints, SortType.OFFERS);
        break;
      default:
        this.#listPoints = [...this.#sourcedListPoints];
    }

    this.#currentSortType = sortType;
  }

  #filterPoints(filterType) {
    switch (filterType) {
      case FilterType.EVERYTHING:
        this.#listPoints = filterPoints(this.#listPoints, FilterType.EVERYTHING);
        break;
      case FilterType.FUTURE:
        this.#listPoints = filterPoints(this.#listPoints, FilterType.FUTURE);
        break;
      case FilterType.PRESENT:
        this.#listPoints = filterPoints(this.#listPoints, FilterType.PRESENT);
        break;
      case FilterType.PAST:
        this.#listPoints = filterPoints(this.#listPoints, FilterType.PAST);
        break;
      default:
        this.#listPoints = [...this.#sourcedListPoints];
    }

    this.#currentFilterType = filterType;
  }//

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderList();
  };

  #handleFilterChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#filterPoints(filterType);
    this.#clearPointList();
    this.#renderList();
  };//

  #renderSort() {
    this.#sortComponent = new ListSortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, mainEventsElement);
  }

  #renderFilter() {
    const filters = generateFilter(this.#listPoints);
    this.#filterComponent = new ListFilterView({
      filters,
      onFilterTypeChange: this.#handleFilterChange,
    });

    render(this.#filterComponent, mainTopElement);
  }//

  #renderList() {
    // this.#renderFilter();//
    if (!this.#listPoints.length) {
      this.#renderNoPoints();
      mainEventsElement.removeChild(document.querySelector('.trip-sort'));
    } else {
      render(this.#tripListComponent, mainEventsElement);
      this.#sortPoints(this.#currentSortType);
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
  }

  #renderBoard() {
    // this.#renderFilter();
    this.#renderSort();
    this.#renderList();
  }

  #renderTripMain() {
    this.#renderFilter();
  }

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filteredPoints = [...this.#pointsModel.points];
    this.#listPoints = [...this.#pointsModel.points];
    this.#sourcedListPoints = [...this.#pointsModel.points];
    this.#soursedFilterPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }
}
