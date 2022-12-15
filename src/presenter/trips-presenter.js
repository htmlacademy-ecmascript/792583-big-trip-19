import ListSortView from '../view/list-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import TripListView from '../view/trip-list-view.js';
import { render, RenderPosition } from '../render.js';

const mainEventsElement = document.querySelector('.trip-events');


export default class TripPresenter {
  tripListComponent = new TripListView();

  constructor({ tripContainer, pointsModel }) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.listPoints = [...this.pointsModel.getPoints()];
    render(new ListSortView(), mainEventsElement);
    render(this.tripListComponent, mainEventsElement);
    render(new NewPointView(), this.tripListComponent.getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 1; i < this.listPoints.length; i++) {
      render(new PointView({ point: this.listPoints[i] }), this.tripListComponent.getElement());
    }
    render(new EditPointView(this.listPoints[0]), this.tripListComponent.getElement(), RenderPosition.AFTERBEGIN);
  }
}
