import activateAlbum from '../helpers/activate-album';
import type { Album } from '../types';
import formatAlbum from '../utils/format-album';

class AlbumsTableRow extends HTMLElement {
  #album: null | Album = null;

  #trElement: null | HTMLElement = null;

  get trElement() {
    if (!this.#trElement) {
      throw new Error('Wrong HTML');
    }
    return this.#trElement;
  }

  connectedCallback() {
    if (!this.dataset.data || !this.dataset.trId) {
      throw new Error('No album data');
    }
    this.#album = JSON.parse(this.dataset.data);
    if (!this.#album) {
      throw new Error('No album data');
    }
    // eslint-disable-next-line no-console
    console.debug(formatAlbum(this.#album, true), `${this.#album.numberOfTracks} tracks`);
    this.#trElement = document.querySelector(`#${this.dataset.trId}`);
    this.trElement.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.trElement.removeEventListener('click', this.handleClick);
  }

  handleClick = () => {
    if (!this.#album) {
      throw new Error('album missing');
    }
    activateAlbum(this.#album);
  };
}
globalThis.customElements.define('albums-table-row', AlbumsTableRow);
