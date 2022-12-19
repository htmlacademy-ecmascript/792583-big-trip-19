import AbstractView from '../framework/view/abstract-view.js';
import { destinations, offersByTypes } from '../mock/mock.js';
import dayjs from 'dayjs';

const DATE_FORMAT_DATE = 'MMM DD';
const DATE_FORMAT_TIME = 'HH:mm';

const createPointTemplate = (point) => {
  const { type, offers, destination, basePrice, isFavorite, dateFrom, dateTo } = point;
  const pointTypeOffer = offersByTypes.find((offer) => offer.type === type);
  const pointDestination = destinations.find((item) => destination === item.id);
  const checkedOffers = pointTypeOffer.offers
    .filter((offer) => offers.includes(offer.id));

  const offersTemplate = () => {
    if (!checkedOffers.length) {
      return `<li class="event__offer">
    <span class="event__offer-title">No additional offers</span>
    </li>`;
    } else {
      const template = checkedOffers.map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`).join('');
      return template;
    }
  };

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);

  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${parceDateStart.format(DATE_FORMAT_DATE)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${parceDateStart.format(DATE_FORMAT_TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${parceDateEnd.format(DATE_FORMAT_TIME)}</time>
          </p>
          <p class="event__duration">40M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate()}
        </ul>
        <button class="${favoriteClassName}" type="button">
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

  constructor({ point }) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }
}
