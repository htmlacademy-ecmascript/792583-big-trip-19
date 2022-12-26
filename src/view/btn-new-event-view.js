import AbstractView from '../framework/view/abstract-view.js';

const createNewEventBtnTemplate = () => ('<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>');
export default class NewEventBtnView extends AbstractView {

  // #button = null;
  #handleButtonClick = null;

  constructor({ /* button, */ onNewEventClick }) {
    super();
    // this.#button = button;
    this.#handleButtonClick = onNewEventClick;

    this.element.querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this.#btnClickHandler);
  }

  get template() {
    return createNewEventBtnTemplate(/* this.#button */);
  }

  #btnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}
