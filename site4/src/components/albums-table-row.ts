import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { Album } from '../types';
import formatAlbum from '../utils/format-album';

export const tagName = 'albums-table-row';
@customElement(tagName)
export default class AlbumsTableRow extends LitElement {
  static override styles = css`
    :host {
      display: table-row;
    }
    :host > div {
      display: table-cell;
      vertical-align: middle;
      border-bottom: 1px solid lightgrey;
    }
    .place {
      padding-left: 1vw;
    }
    :host img {
      border-radius: 50%;
      height: 2rem;
      width: 2rem;
    }
  `;

  @property({
    hasChanged(value, oldValue) {
      return (
        (value && formatAlbum(value as Album)) !==
        (oldValue && formatAlbum(oldValue as Album))
      );
    },
    type: Object,
  })
  declare album: Album;

  @property({ type: Number }) declare place: number;

  override connectedCallback() {
    super.connectedCallback();
    if (!this.album) {
      throw new Error('No album data');
    }
    // eslint-disable-next-line no-console
    console.debug(
      formatAlbum(this.album, true),
      `${this.album.numberOfTracks} tracks`,
    );
    this.addEventListener('click', this.handleClick);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleClick);
    super.disconnectedCallback();
  }

  handleClick = () => {
    this.dispatchEvent(
      new CustomEvent('activate-album', {
        bubbles: true,
        composed: true,
        detail: this.album,
      }),
    );
  };

  override render() {
    if (!this.album) {
      return 'No data';
    }
    return html`
      <div class="place">${this.place}</div>
      <div>${this.album ? formatAlbum(this.album, false) : null}</div>
      <div>
        ${this.album.date
          ? html`<time datetime="${this.album.date}">${this.album.date}</time>`
          : ''}
      </div>
      <div>
        ${this.album.thumbnail
          ? html`
              <figure class="image is-32x32">
                <img class="is-rounded" src="${this.album.thumbnail}" />
              </figure>
            `
          : ''}
      </div>
    `;
  }
}
