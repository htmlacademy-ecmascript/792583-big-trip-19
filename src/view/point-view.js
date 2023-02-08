import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { durationDate } from '../utils/date.js';
import { getOffersByType, getSelectedDestination, getSelectedOffers } from '../utils/point.js';
import he from 'he';

const DATE_FORMAT_DATE = 'MMM DD';
const DATE_FORMAT_TIME = 'HH:mm';

const createOffersTemplate = (offersTemplate) => {
  if (!offersTemplate.length) {
    return '';
  }
  return offersTemplate
    .map(
      (offer) =>
        `<li class="event__offer">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
          +€&nbsp;
          <span class="event__offer-price">${he.encode(String(offer.price))}</span>
        </li>`
    ).join('');
};

const createPointTemplate = (point, destinations, offers) => {

  const { type, basePrice, isFavorite, dateFrom, dateTo } = point;

  const offersType = getOffersByType(offers, point.type);
  const destination = getSelectedDestination(destinations, point.destination);

  offers = getSelectedOffers(offersType, point.offers);

  if (!destination) {
    return '';
  }
  const { name } = destination;

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);

  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${parceDateStart.format(DATE_FORMAT_DATE)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${he.encode(name)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${parceDateStart.format(DATE_FORMAT_TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${parceDateEnd.format(DATE_FORMAT_TIME)}</time>
          </p>
          <p class="event__duration">${durationDate(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class PointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, offersForPoint, destinationsForPoint, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#offers = offersForPoint;
    this.#destinations = destinationsForPoint;

    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

}
