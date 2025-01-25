import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import toPairs from 'lodash/toPairs';
import { nanoid } from 'nanoid';

import './copy-text';
import './album-place';
import './album-tag';
import './modal';

import type { Album } from '../types';
import formatAlbum from '../utils/format-album';
import stopPropagation from '../utils/stop-propagation';

@customElement('album-modal')
export default class AlbumModal extends LitElement {
  randomId = nanoid();

  static override styles = css`
    ymh-modal {
      text-align: center;
    }
    .header {
      flex-direction: row;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.1rem;
    }
    album-place,
    album-tag {
      overflow: hidden;
    }
  `;

  @property({
    reflect: true,
  })
  declare active: null | true;

  @property({
    hasChanged(value, oldValue) {
      return (
        (value && formatAlbum(value as Album)) !==
        (oldValue && formatAlbum(oldValue as Album))
      );
    },
    type: Object,
  })
  declare album: Album | null;
  // @query('.image img') imgElement!: HTMLImageElement;
  // @query('.album-places') placesElement!: HTMLElement;
  // @query('.modal-card-title') titleElement!: HTMLElement;
  // @query('.album-tags') tagsElement!: HTMLElement;

  handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
    this.active = null;
  }

  constructor() {
    super();
    this.active = null;
  }

  get albumTitle() {
    return this.album && formatAlbum(this.album, true);
  }

  get textToCopy() {
    if (!this.album) {
      return '';
    }
    return `"${this.album.artist}" - "${this.album.name}"`;
  }

  override attributeChangedCallback(
    attributeName: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(attributeName, oldValue, newValue);
    if (attributeName !== 'album') {
      return;
    }
    if ((!oldValue || oldValue === 'null') && newValue && newValue !== 'null') {
      this.active = true;
    } else if (oldValue && (!newValue || newValue === 'null')) {
      this.active = null;
    }
  }

  renderContent() {
    return html`<img
        height="400"
        width="400"
        alt="Cover art"
        src="${this.album?.cover}"
        @click="${stopPropagation}"
      />
      <p class="tags" @click="${stopPropagation}">
        Places:${' '}${repeat(
          toPairs(this.album?.places),
          ([tagName]) => tagName,
          ([tagName, place]) => {
            return html`<album-place
              place="${place}"
              tag="${tagName}"
            ></album-place>`;
          },
        )}
      </p>
      <p class="tags" @click="${stopPropagation}">
        Tags:${' '}${repeat(
          toPairs(this.album?.tags || undefined),
          ([tagName]) => tagName,
          ([tagName, value]) => {
            return html`
              <album-tag tag="${tagName}" value="${value}"></album-tag>
            `;
          },
        )}
      </p>`;
  }

  override render() {
    return this.renderNord();
  }

  renderNord() {
    return html`
      <ymh-modal
        @close="${this.handleClose}"
        id="modal-${this.randomId}"
        ?open="${this.active}"
        aria-labelledby="title-${this.randomId}"
      >
        <h2 @click="${stopPropagation}" id="title-${this.randomId}">
          ${this.albumTitle}
          ${this.album
            ? html`<copy-text text="${this.textToCopy}">Copy</copy-text>`
            : nothing}
        </h2>
        ${this.renderContent()}

        <button @click="${this.handleClose}" id="cancelButton">Close</button>
      </ymh-modal>
    `;
  }
}
