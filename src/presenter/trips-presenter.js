import ListSortView from '../view/list-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import TripListView from '../view/trip-list-view.js';
import { render } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';

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

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event__save-btn').addEventListener('submit', (evt) => {
      evt.preventDefault();
      // replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#tripListComponent.element);
  }

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    if (this.#listPoints.length === 0) {
      render(new ListEmptyView(), mainEventsElement);
    } else {
      render(new ListSortView(), mainEventsElement);
      render(this.#tripListComponent, mainEventsElement);
      // render(new NewPointView(), this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
    // render(new EditPointView(this.#listPoints[0]), this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
  }
}
