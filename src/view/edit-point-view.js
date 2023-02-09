import dayjs from 'dayjs';
import AbsrtactStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import { priceValidation } from '../utils/point.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const DefaultPointData = {
  DATE_FROM: new Date(dayjs().toISOString()),
  DATE_TO: new Date(dayjs().add(1, 'hours').toISOString()),
  TYPE: 'taxi'
};
const BLANK_POINT = {
  id: null,
  type: DefaultPointData.TYPE,
  dateFrom: DefaultPointData.DATE_FROM,
  dateTo: DefaultPointData.DATE_TO,
  offers: [],
  destination: '',
  basePrice: '',
  isFavorite: false,
};

const createEditPointTemplate = (point, offers, destinations) => {
  const { type, destination, basePrice, dateFrom, dateTo, offers: selectedOffersId, isDisabled, isSaving, isDeleting } = point;
  const pointTypeOffer = offers.find((offer) => offer.type === type);
  const pointDestination = destinations.find((item) => destination === item.id);
  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);
  const isNewPoint = !point.id;
  const isDeleteBtnText = isDeleting ? 'Deleting...' : 'Delete';

  const pointTypeItemTemplate = () => offers.map((element) =>
    `<div class="event__type-item">
    <input id="event-type-${he.encode(element.type)}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${he.encode(element.type)}"${element.type === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${element.type}" for="event-type-${element.type}-1">${element.type.charAt(0).toUpperCase() + element.type.slice(1)}</label>
  </div>`).join('');

  const destinationTemplate = () => destinations.map((element) => `<option value="${he.encode(element.name)}"></option>`).join('');

  const createOffersSectionTemplate = () => {
    if (!pointTypeOffer.offers.length) {
      return '';
    }

    return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${pointTypeOffer.offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${he.encode(offer.title)}-${he.encode(String(offer.id))}" type="checkbox" name="${he.encode(offer.title)}" data-offer-id="${he.encode(String(offer.id))}" ${selectedOffersId.includes(offer.id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${he.encode(offer.title)}-${offer.id}">
              <span class="event__offer-title">${he.encode(offer.title)}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${he.encode(String(offer.price))}</span>
            </label>
          </div>`).join('')}
      </div>
    </section>`;
  };

  const destinationSectionTemplate = () => {
    if (!pointDestination) {
      return '';
    }

    return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(pointDestination.description)}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}"></img>`).join('')}
        </div>
      </div>
    </section>`;
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
           ${pointTypeItemTemplate()}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${he.encode(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? he.encode(pointDestination.name) : ''}" list="destination-list-1" placeholder="Select a city from the list" required>
        <datalist id="destination-list-1">
          ${destinationTemplate()}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${parceDateStart.format(DATE_FORMAT)}"${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${parceDateEnd.format(DATE_FORMAT)}"${isDisabled ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.basePrice ? he.encode(String(basePrice)) : ''}" required>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset"${isDisabled ? 'disabled' : ''}>${isNewPoint ? 'Cancel' : isDeleteBtnText}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
    ${createOffersSectionTemplate()}
    ${destinationSectionTemplate()}
    </section>
  </form>
  </li>`;
};

export default class EditPointView extends AbsrtactStatefulView {
  #destinations = null;
  #offersFoType = null;
  #handleFormSubmit = null;
  #handleFormClose = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;


  constructor({ point = BLANK_POINT, offersForType, destinations, onFormSubmit, onFormClose, onDeleteClick }) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offersFoType = offersForType;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offersFoType, this.#destinations);
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
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
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelectorAll('.event__offer-selector input')
      .forEach((offer) => offer.addEventListener('change', this.#offerEventHandler));

    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  }

  #setDateFromDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        enableTime: true,
      }
    );
  }

  #setDateToDatepicker() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        enableTime: true,
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const submitButton = this.element.querySelector('.event__save-btn');

    if (this._state.dateFrom >= this._state.dateTo) {
      submitButton.disabled = true;
      submitButton.textContent = 'Change date';
      return;
    }
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
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

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom,
    });
    this.#setDateToDatepicker();
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo,
    });
    this.#setDateFromDatepicker();
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this.value = priceValidation(evt.target.value);
    this.updateElement({
      basePrice: priceValidation(evt.target.value),
    });
  };

  #offerEventHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const currentOfferId = Number(evt.target.dataset.offerId);
      const currentOfferIndex = this._state.offers.indexOf(currentOfferId);

      if (currentOfferIndex === -1) {
        this._state.offers.push(currentOfferId);
        return;
      }

      this._state.offers.splice(currentOfferIndex, 1);
    }
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);
    if (!selectedDestination) {
      evt.target.value = '';
      return;
    }
    this.updateElement({
      destination: selectedDestination.id,
      pictures: []
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    delete point.pictures;

    return point;
  }
}
