import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import clipboardIcon from '../icons/clipboard.svg';

@customElement('copy-text')
export default class CopyText extends LitElement {
  static override styles = css`
    img {
      max-height: 19.5px;
      max-width: 19.5px;
    }
  `;

  @property({ type: String }) declare text: string;

  protected copy() {
    globalThis.navigator.clipboard.writeText(this.text);
    this.dispatchEvent(
      new CustomEvent('copy-text', {
        bubbles: true,
        composed: true,
        detail: this.text,
      }),
    );
  }

  protected override render(): unknown {
    return html`<button @click="${this.copy}" type="button" aria-label="Copy to clipboard" title="Copy to clipboard">
      <img src="${clipboardIcon}" /></nord-button>`;
  }
}
