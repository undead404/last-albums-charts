import forEach from 'lodash/forEach';
import toPairs from 'lodash/toPairs';
import toString from 'lodash/toString';

import './album-place';
import './album-tag';

import type { Album } from '../types';
import formatAlbum from '../utils/format-album';
import createElement from '../utils/create-element';

const WRONG_HTML_ERROR_MESSAGE = 'Wrong HTML';

class AlbumModal extends HTMLElement {
  #titleElement: null | Element = null;

  #imgElement: null | HTMLImageElement = null;

  #tagsElement: null | HTMLElement = null;

  #placesElement: null | HTMLElement = null;

  connectedCallback() {
    this.addEventListener(
      'activate-album',
      this.handleActivateAlbum as EventListener,
    );
    forEach(
      this.querySelectorAll('.close, .delete, .modal-background, .modal-close'),
      (closeButton) => {
        closeButton.addEventListener('click', this.handleClose);
      },
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      'activate-album',
      this.handleActivateAlbum as EventListener,
    );
    forEach(
      this.querySelectorAll('.close, .delete, .modal-background, .modal-close'),
      (closeButton) => {
        closeButton.removeEventListener('click', this.handleClose);
      },
    );
  }

  get imgElement() {
    if (this.#imgElement) {
      return this.#imgElement;
    }
    const result = this.querySelector<HTMLImageElement>('.image img');
    if (!result) {
      throw new Error(WRONG_HTML_ERROR_MESSAGE);
    }
    this.#imgElement = result;
    return result;
  }

  get placesElement() {
    if (this.#placesElement) {
      return this.#placesElement;
    }
    const result = this.querySelector<HTMLElement>('.tags');
    if (!result) {
      throw new Error(WRONG_HTML_ERROR_MESSAGE);
    }
    this.#placesElement = result;
    return result;
  }

  get tagsElement() {
    if (this.#tagsElement) {
      return this.#tagsElement;
    }
    const result = this.querySelector<HTMLElement>('.album-tags');
    if (!result) {
      throw new Error(WRONG_HTML_ERROR_MESSAGE);
    }
    this.#tagsElement = result;
    return result;
  }

  get titleElement() {
    if (this.#titleElement) {
      return this.#titleElement;
    }
    const result = this.querySelector('.modal-card-title');
    if (!result) {
      throw new Error(WRONG_HTML_ERROR_MESSAGE);
    }
    this.#titleElement = result;
    return result;
  }

  handleActivateAlbum = (event: CustomEvent<Album>) => {
    const album = event.detail;
    this.titleElement.textContent = formatAlbum(album);
    if (album.cover) {
      this.imgElement.setAttribute('src', album.cover);
    } else {
      this.imgElement.style.display = 'none';
    }
    this.placesElement.textContent = 'Places: ';
    forEach(toPairs(album.places), ([tagName, place]) => {
      const albumPlaceElement = createElement('album-place', {
        dataset: {
          place: toString(place),
          tagName: tagName,
        }
      });
      this.placesElement.append(albumPlaceElement);
    });
    this.tagsElement.textContent = 'Tags: ';
    forEach(toPairs(album.tags || {}), ([tagName, value]) => {
      const albumTagElement = createElement('album-tag', {
        dataset: {
          value: toString(value),
          tagName: tagName,
        }
      });
      this.tagsElement.append(albumTagElement);
    });
    this.classList.add('is-active');
  };

  handleClose = () => {
    this.classList.remove('is-active');
  };
}
globalThis.customElements.define('album-modal', AlbumModal);
