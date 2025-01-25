import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import getNextId from '../utils/get-next-id';

@customElement('album-tag')
export default class AlbumTag extends LitElement {
  static override styles = css`
    :host {
      cursor: pointer;
    }
    a {
      display: flex;
      font-size: 0.75rem;
      padding: 0.5rem;
      white-space: nowrap;
      line-height: 0.75rem;
      text-decoration: none;
      box-sizing: border-box;
      height: 1.75rem;
    }
    a:hover {
      border-bottom: 1px solid #0000ee;
    }
    a:visited:hover {
      border-bottom: 1px solid #551a8b;
    }
    meter {
      margin-left: 0.5rem;
    }
  `;

  @property({
    type: Number,
  })
  declare value: number;

  @property() declare tag: string;

  declare meterId: string;

  constructor() {
    super();
    this.value = 0;
    this.tag = '';
    this.meterId = getNextId();
  }

  override render() {
    return html`
      <a href="/tag/${encodeURIComponent(this.tag)}"
        ><label for="${this.meterId}"
          >${this.tag}<meter
            id="${this.meterId}"
            low="50"
            max="100"
            min="0"
            optimum="100"
            value="${this.value}"
          >
            ${this.value}
          </meter></label
        ></a
      >
    `;
  }
}
