import TripListView from '../view/trip-list-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortPoints } from '../utils/task.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import BoardView from '../view/board-view.js';

export default class TripPresenter {
  #pointsModel = null;
  #listContainer = null;
  #filtersContainer = null;
  #filterModel = null;
  #newPointPresenter = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #pointListComponent = new TripListView();
  #boardComponent = new BoardView();
  #noPointsComponent = null;
  #filteredPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #soursedFilterPoints = [];
  #filterComponent = null;
  #sortComponent = null;

  constructor({ listContainer, filtersContainer, pointsModel, filterModel, onNewPointDestroy }) {
    this.#listContainer = listContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return sortPoints(filteredPoints, SortType.DAY);
      case SortType.EVENT:
        return sortPoints(filteredPoints, SortType.EVENT);
      case SortType.TIME:
        return sortPoints(filteredPoints, SortType.TIME);
      case SortType.PRICE:
        return sortPoints(filteredPoints, SortType.PRICE);
      case SortType.OFFERS:
        return sortPoints(filteredPoints, SortType.OFFERS);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderPoint(point) {

    const pointPresenter = new PointPresenter({
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderNoPoints() {
    this.#noPointsComponent = new ListEmptyView({
      filterType: this.#filterType,
    });
    render(this.#noPointsComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new ListSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    render(this.#pointListComponent, this.#listContainer);
    const points = this.points;
    const pointsCount = points.length;
    if (!pointsCount) {
      this.#renderNoPoints();
      return;
    }
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSort();
    for (let i = 0; i < points.length; i++) {

      this.#renderPoint(points[i], this.destinations, this.offers,);
    }
    // this.#clearBoard();
  }
}
