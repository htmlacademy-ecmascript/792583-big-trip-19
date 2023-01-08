import TripListView from '../view/trip-list-view.js';
import { render, replace } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType } from '../const.js';
import { sortPointUp, sortPointDown } from '../utils/task.js';


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
        this.#listPoints.sort(sortPointUp);
        break;
      case SortType.TIME:
        this.#listPoints.sort(sortPointDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#listPoints = [...this.#sourcedListPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    // this.#renderPointList();
  };

  #renderPoints(from, to) {
    this.#listPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    this.#sortComponent = new ListSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, mainEventsElement);
  };

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    // render(new NewEventBtnView(), tripMain);
    this.#listPoints = [...this.#pointsModel.points];
    this.#sourcedListPoints = [...this.#pointsModel.points];
    if (!this.#listPoints.length) {
      this.#renderNoPoints();
      mainEventsElement.removeChild(document.querySelector('.trip-sort'));
    } else {
      render(this.#tripListComponent, mainEventsElement);
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
  }
}
