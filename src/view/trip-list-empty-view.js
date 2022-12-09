import { createElement } from '../render.js';

function createTripListEmptyTemplate() {
  return `<p class="trip-events__msg">Click New Event to create your first point
  </p>`;
}

export default class TripListEmptyTemplate {
  getTemplate() {
    return createTripListEmptyTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
