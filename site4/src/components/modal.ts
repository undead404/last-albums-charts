import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import isNil from 'lodash/isNil';

@customElement('ymh-modal')
export default class Modal extends LitElement {
  static override styles = css`
    dialog:modal {
      max-width: min(100vw, 800px);
    }
  `;

  // @query('dialog') private declare dialog: HTMLDialogElement;
  private dialog: HTMLDialogElement | null = null;

  @property({ type: Boolean }) declare open: boolean;

  override async connectedCallback() {
    super.connectedCallback();
    this.dialog = this.shadowRoot?.querySelector?.('dialog') || null;
    const { default: dialogPolyfill } = await import('dialog-polyfill');
    if (this.dialog) dialogPolyfill.registerDialog(this.dialog);
    this.addEventListener('click', this.hide as EventListener);
    this.addEventListener('keydown', this.hide as EventListener);
  }

  hide() {
    this.dialog?.close?.();
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true }),
    );
  }

  show() {
    this.dialog?.showModal?.();
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === 'open') {
      if (isNil(newValue)) {
        this.hide();
      } else {
        this.show();
      }
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  override render() {
    return html`<dialog @close="${this.hide}" ?open="${this.open}">
      <slot></slot>
    </dialog> `;
  }
}
