import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

function createFilterItemTemplate(filter) {

  const { name, count } = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio" name="trip-filter"
    value="${name}"${count === 0 ? 'disabled' : ''}${FilterType.EVERYTHING === name ? 'checked' : ''}>
    <label class="trip-filters__filter-label"
    for="filter-${name}">${name}</label>
    </div>`
  );
}

function createListFilterTemplate(filterItems) {

  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`
  );
}
export default class ListFilterView extends AbstractView {
  #filters = null;
  #handleFilterChange = null;

  constructor({ filters, onFilterChange }) {
    super();
    this.#filters = filters;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHadler);
  }

  get template() {
    return createListFilterTemplate(this.#filters);
  }

  #filterChangeHadler = (evt) => {
    if (evt.target.tagName !== 'LABEL' || evt.target.hasAttribute('disabled')) {
      return;
    }

    this.#handleFilterChange(evt.target.dataset.filterType);
  };
}
