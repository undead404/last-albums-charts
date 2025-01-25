import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import orderBy from 'lodash/orderBy';

import './albums-table-heading';
import './albums-table-row';
import './album-modal';

import type { Album, AlbumPlaceItem } from '../types';
import ALBUMS_SORT_KEYS from '../utils/albums-sort-keys';

export const tagName = 'albums-table';
@customElement(tagName)
export default class AlbumsTable extends LitElement {
  static override styles = css`
    :host {
      background-color: transparent;
      display: table;
      width: 100%;
    }
    .tbody {
      display: table-row-group;
    }
  `;

  @property({ type: Array }) declare albumsPlaces: AlbumPlaceItem[];

  @state() private declare sortCriterion: 'album' | 'date' | 'place';

  @state() private declare sortOrder: 'asc' | 'desc';

  @state() private declare activeAlbum: null | Album;

  constructor() {
    super();
    this.sortCriterion = 'date';
    this.sortOrder = 'asc';
    this.activeAlbum = null;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'activate-album',
      this.handleActivateAlbum as EventListener,
    );
    this.addEventListener('sort', this.handleSort as EventListener);
    this.addEventListener('copy-text', this.handleCopyText as EventListener);
  }

  handleActivateAlbum = (event: CustomEvent<Album>) => {
    this.activeAlbum = event.detail;
  };

  handleCopyText(event: CustomEvent<{ text: string }>) {
    // this.toastGroup.addToast(`Copied to clipboard: ${event.detail.text}`);
  }

  handleDeactivateAlbum() {
    this.activeAlbum = null;
  }

  get sortedAlbumsPlaces() {
    const criterion =
      this.sortCriterion in ALBUMS_SORT_KEYS
        ? ALBUMS_SORT_KEYS[this.sortCriterion]
        : ALBUMS_SORT_KEYS.date;
    return orderBy(this.albumsPlaces, [criterion], [this.sortOrder]);
  }

  handleSort = (
    event: CustomEvent<{
      criterion: 'album' | 'date' | 'place';
      isReverse: boolean;
    }>,
  ) => {
    this.sortCriterion = event.detail.criterion;
    this.sortOrder = event.detail.isReverse ? 'desc' : 'asc';
  };

  // override updated() {
  //   dedupeElement(this.shadowRoot, 'albums-table-heading');
  //   dedupeElement(this.shadowRoot, '.tbody');
  //   dedupeElement(this.shadowRoot, 'album-modal');
  //   this.addEventListener('sort', this.handleSort as EventListener);
  // }

  override render() {
    // alert('albums-table rendered');
    return html`
      <albums-table-heading
        sortCriterion="${this.sortCriterion}"
        sortOrder="${this.sortOrder}"
      ></albums-table-heading>
      <div class="tbody">
        ${repeat(
          this.sortedAlbumsPlaces,
          ({ place }) => place,
          ({ album, place }) =>
            html`
              <albums-table-row
                album="${JSON.stringify(album)}"
                place="${place}"
              ></albums-table-row>
            `,
        )}
      </div>
      <album-modal
        @close=${this.handleDeactivateAlbum}
        album="${this.activeAlbum ? JSON.stringify(this.activeAlbum) : null}"
      ></album-modal>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    [tagName]: AlbumsTable;
  }
}
