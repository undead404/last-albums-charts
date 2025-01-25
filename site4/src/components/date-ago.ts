import { formatDistance } from 'date-fns';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const tagName = 'date-ago';

@customElement(tagName)
export default class DateAgo extends LitElement {
  @property({
    converter(value) {
      if (!value) {
        return null;
      }
      return new Date(Number.parseInt(value, 10));
    },
  })
  declare date: Date | null;

  get distance() {
    if (!this.date) {
      return 'Never';
    }
    return formatDistance(this.date, new Date(), { addSuffix: true });
  }

  override render() {
    return html`
      <time datetime=${this.date?.toISOString?.() || null}
        >${this.distance}</time
      >
    `;
  }
}
