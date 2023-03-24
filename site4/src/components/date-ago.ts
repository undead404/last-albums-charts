import { formatDistance } from 'date-fns';

class DateAgo extends HTMLElement {
  constructor() {
    super();

    const dateTimestamp = this.dataset.date;
    if (!dateTimestamp) {
      return;
    }
    const date = new Date(Number.parseInt(dateTimestamp, 10));
    const $timeElement = this.querySelector('time');
    if (!$timeElement) {
      return;
    }
    $timeElement.textContent = formatDistance(date, new Date(), {
      addSuffix: true,
    });
  }
}

globalThis.customElements.define('date-ago', DateAgo);
