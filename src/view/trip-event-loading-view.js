import { createElement } from '../render.js';

function createTripListLoadingTemplate() {
  return `<p class="trip-events__msg">Loading...
  </p>`;
}

export default class TripListLoadingTemplate {
  getTemplate() {
    return createTripListLoadingTemplate();
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
