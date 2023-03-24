import forEach from 'lodash/forEach';
import orderBy from 'lodash/orderBy';

class AlbumsTable extends HTMLElement {
  #albumRows: NodeListOf<HTMLTableRowElement> | null = null;

  #table: HTMLTableElement | null = null;

  connectedCallback() {
    this.#table = this.querySelector('table');
    if (!this.#table) {
      throw new Error('table element not found');
    }
    this.#albumRows = this.#table.querySelectorAll('tbody tr');
    this.#table.addEventListener('sort', this.handleSort as EventListener);
  }

  handleSort = (
    event: CustomEvent<{
      criterion: 'album' | 'date' | 'place';
      isReverse: boolean;
    }>,
  ) => {
    const sortedElements = orderBy(
      this.#albumRows,
      [(albumRow) => albumRow.dataset[event.detail.criterion]],
      [event.detail.isReverse ? 'desc' : 'asc'],
    );
    forEach(sortedElements, (sortedElement) => {
      const parent = sortedElement.parentElement;
      if (!parent) {
        throw new Error('Something went wrong');
      }
      sortedElement.remove();
      parent.append(sortedElement);
    });
  };
}
globalThis.customElements.define('albums-table', AlbumsTable);
