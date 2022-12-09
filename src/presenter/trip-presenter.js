import { render } from '../render.js';
import TripEventListView from '../view/trip-event-list-view';
import TripFilterView from '../view/trip-filter-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventEditDestinationView from '../view/trip-event-edit-destination-view.js';
import TripEventEditOfferTemplate from '../view/trip-event-edit-offer-view.js';
import TripEventEditTemplate from '../view/trip-event-edit-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripListEmptyTemplate from '../view/trip-list-empty-view.js';
import TripListLoadingTemplate from '../view/trip-event-loading-view.js';
import TripEditPointTemplate from '../view/trip-edit-point-view.js';

export default class TripPresenter {
  MAX_POINT_COUNT = 3;
  tripListComponent = new TripEventListView();

  constructor({ boardContainer, filterContainer }) {
    this.boardContainer = boardContainer;
    this.filterContainer = filterContainer;
  }

  init() {
    render(new TripFilterView, this.filterContainer);
    render(new TripSortView, this.boardContainer);
    render(this.tripListComponent, this.boardContainer);
    render(new TripEditPointTemplate, this.tripListComponent.getElement());
    for (let i = 0; i < this.MAX_POINT_COUNT; i++) {
      render(new TripEventItemView(), this.tripListComponent.getElement());
    }
    render(new TripEventEditTemplate, this.tripListComponent.getElement());
    render(new TripEventEditOfferTemplate, this.tripListComponent.getElement());
    render(new TripEventEditDestinationView, this.tripListComponent.getElement());
    render(new TripListEmptyTemplate, this.tripListComponent.getElement());
    render(new TripListLoadingTemplate, this.tripListComponent.getElement());
  }
}
