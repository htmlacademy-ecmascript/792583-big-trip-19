import { destinations, offersByTypes } from '../mock/mock.js';
import dayjs from 'dayjs';
import { TYPE } from '../const.js';
import AbsrtactStatefulView from '../framework/view/abstract-stateful-view.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const BLANK_POINT = {
  id: 1,
  type: TYPE[0],
  offers: [],
  destination: 1,
  basePrice: 300,
  isFavorite: true,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
};

const createEditPointTemplate = (point) => {
  const { type, offers, destination, basePrice, dateFrom, dateTo } = point;
  const pointTypeOffer = offersByTypes.find((offer) => offer.type === type);
  const pointDestination = destinations.find((item) => destination === item.id);

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);

  const pointTypeItemTemplate = offersByTypes.map((element) =>
    `<div class="event__type-item">
    <input id="event-type-${element.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${element.type}">
    <label class="event__type-label  event__type-label--${element.type}" for="event-type-${element.type}-1">${element.type}</label>
  </div>`).join('');

  const offersTemplate = pointTypeOffer.offers
    .map((offer) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="${offer.title}" data-offer-id="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

  const destinationTemplate = destinations.map((element) => `<option value="${element.name}"></option>`).join('');

  //пытался скрыть секцию офферс
  const offersSection = pointTypeOffer.offers ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${offersTemplate}
  </div>
</section>` : '';
  const photosTemplate = pointDestination.pictures ? `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}"></img>`).join('')}
  </div>
</div>` : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
           ${pointTypeItemTemplate}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationTemplate}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${parceDateStart.format(DATE_FORMAT)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${parceDateEnd.format(DATE_FORMAT)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">

    ${offersSection}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination.description}</p>
        ${photosTemplate}
      </section>
    </section>
  </form>
  </li>`;
};

export default class EditPointView extends AbsrtactStatefulView {

  #point = null;
  #handleFormSubmit = null;
  #handleFormClose = null;

  constructor({ point = BLANK_POINT, onFormSubmit, onFormClose }) {
    super();
    // this.#point = point;
    this._setState(EditPointView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this._restoreHandlers();
  }

  get template() {
    // return createEditPointTemplate(this.#point);
    return createEditPointTemplate(this._state);
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerEventHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    // this.#handleFormSubmit(this.#point);
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  #typeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.value
    });
  };

  #offerEventHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      offers: evt.target.value,
    });
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    // this.updateElement({
    //   destination: !this._state.destination.id,
    const checkDestination = destinations.find((destination) => evt.target.value === destination.name);

    this.updateElement({
      destination: checkDestination.id,
      pictures: []
    });
  };

  static parsePointToState(point) {
    return {
      ...point
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (!point.type) {
      point.type = null;
    }
    if (!point.offers) {
      point.offers = null;
    }
    if (!point.destination) {
      point.destination = null;
    }

    delete point.type;
    delete point.offers;
    delete point.destination;

    return point;
  }
}
