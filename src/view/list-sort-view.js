import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function renderSortOptionsTemplate(sorts) {

  const { name, count } = sorts;

  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
          <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${count === 0 ? 'disabled' : ''}>
          <label class="trip-sort__btn" for="sort-${name}" data-sort-type="${name}">${name}</label>
    </div>`
  );
}


function createSortTemplate(sorts) {

  const sortItemsTemplate = sorts.map((sort, index) => renderSortOptionsTemplate(sort, index === 0)).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
  </form>` );
}
export default class ListSortView extends AbstractView {
  #sorts = null;
  #handleSortTypeChange = null;

  constructor({ sorts, onSortTypeChange }) {
    super();
    this.#sorts = sorts;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'DIV') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
