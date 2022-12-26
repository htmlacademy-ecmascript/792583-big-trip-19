import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import TripListView from '../view/trip-list-view.js';
import { render, replace } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import NewEventBtnView from '../view/btn-new-event-view.js';

const mainEventsElement = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
export default class TripPresenter {
  #pointsModel = null;
  #tripContainer = null;

  #tripListComponent = new TripListView();

  #listPoints = [];

  #renderPoint(point) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      onEditClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditPointView({
      point,
      onEditClick: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#tripListComponent.element);
  }

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    render(new NewEventBtnView(), tripMain);
    this.#listPoints = [...this.#pointsModel.points];
    if (this.#listPoints.length === 0) {
      render(new ListEmptyView(), mainEventsElement);
      mainEventsElement.removeChild(document.querySelector('.trip-sort'));
    } else {
      render(this.#tripListComponent, mainEventsElement);
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
  }
}
