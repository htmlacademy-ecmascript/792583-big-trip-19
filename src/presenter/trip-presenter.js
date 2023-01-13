import TripListView from '../view/trip-list-view.js';
import { render } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType } from '../const.js';
import { sortPoints } from '../utils/task';


const mainEventsElement = document.querySelector('.trip-events');

export default class TripPresenter {
  #pointsModel = null;
  #tripContainer = null;

  #tripListComponent = new TripListView();
  #noPointsComponent = new ListEmptyView();
  #listPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedListPoints = [];
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderList();
  };

  #renderPoints(from, to) {
    this.#listPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    this.#sortComponent = new ListSortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, mainEventsElement);
  }

  #renderList() {
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
    this.#renderSort();
    this.#renderList();
  }

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#sourcedListPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }
}
