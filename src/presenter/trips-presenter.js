import ListSortView from '../view/list-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import TripListView from '../view/trip-list-view.js';
import { render, RenderPosition } from '../render.js';

const mainEventsElement = document.querySelector('.trip-events');


export default class TripPresenter {
  #pointsModel = null;
  #tripContainer = null;

  #tripListComponent = new TripListView();

  #listPoints = [];

  #renderPoint(point) {
    const pointComponent = new PointView({ point });
    const pointEditComponent = new EditPointView({ point });

    const replaceCardToForm = () => {
      this.#tripListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#tripListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
    });

    render(pointComponent, this.#tripListComponent.element);
  }

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    render(new ListSortView(), mainEventsElement);
    render(this.#tripListComponent, mainEventsElement);
    render(new NewPointView(), this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#listPoints[i]);
    }
    render(new EditPointView(this.#listPoints[0]), this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
  }
}
