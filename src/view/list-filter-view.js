import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {

  const { name, count, type } = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio" name="trip-filter"
    value="${type}"${count === 0 ? 'disabled' : ''}${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label"
    for="filter-${name}">${name}</label>
    </div>`
  );
}

function createListFilterTemplate(filterItems, currentFilterType) {

  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return (
    `<div class="trip-main__trip-controls  trip-controls">
            <div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>
</div>
          </div>`
  );
}
export default class ListFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, onFilterTypeChange, currentFilterType }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createListFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}
