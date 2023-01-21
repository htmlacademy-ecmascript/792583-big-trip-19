import AbstractView from '../framework/view/abstract-view.js';

const messageForFilter = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'present': 'There are no present events now',
  'past': 'There are no past events now',
};

function createListEmptyTemplate(filterType) {
  return `<p class="trip-events__msg">${messageForFilter[filterType]}</p>`;
}
export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
