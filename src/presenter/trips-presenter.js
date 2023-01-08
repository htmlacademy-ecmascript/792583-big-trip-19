import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import TripListView from '../view/trip-list-view.js';
import { render, replace } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';


const mainEventsElement = document.querySelector('.trip-events');

export default class TripPresenter {
  #pointsModel = null;
  #tripContainer = null;

  #tripListComponent = new TripListView();
  #listPoints = [];

  #renderPoint(point) {

    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
    });

    pointPresenter.init(point);

  }

  #noPointsComponent = new ListEmptyView();

  #renderNoPoints() {
    render(this.#noPointsComponent, mainEventsElement);
  }

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    // render(new NewEventBtnView(), tripMain);
    this.#listPoints = [...this.#pointsModel.points];
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
