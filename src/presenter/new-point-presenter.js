import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #pointsModel = null;
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({ pointsModel, pointListContainer, onDataChange, onDestroy }) {
    this.#pointsModel = pointsModel;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView({
      offersForType: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onFormClose: this.#handleCloseForm,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isSaving: true,
      isDisabled: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleCloseForm = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

}
