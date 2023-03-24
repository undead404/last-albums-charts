import forEach from 'lodash/forEach';

class AlbumsTableHeading extends HTMLElement {
  #table: HTMLElement | null = null;

  #sortTriggers: NodeListOf<HTMLButtonElement> | null = null;

  #sortTriggerHandlers = new WeakMap<
    HTMLButtonElement,
    (event: MouseEvent) => void
  >();

  get table(): HTMLElement {
    if (!this.#table) {
      if (!this.dataset.tableId) {
        throw new Error('No table found');
      }
      this.#table = document.querySelector(`#${this.dataset.tableId}`);
      if (!this.#table) throw new Error('Table not found');
    }
    return this.#table;
  }

  connectedCallback() {
    this.#sortTriggers = this.table.querySelectorAll('.sort-trigger');
    forEach(this.#sortTriggers, (sortTrigger) => {
      const handleClick = () => {
        if (!sortTrigger.dataset.criterion) {
          return;
        }
        if (sortTrigger.classList.contains('active')) {
          sortTrigger.classList.toggle('reverse');
        } else {
          forEach(this.#sortTriggers, (otherSortTrigger) =>
            otherSortTrigger.classList.remove('active'),
          );
          sortTrigger.classList.add('active');
        }
        this.table.dispatchEvent(
          new CustomEvent('sort', {
            detail: {
              criterion: sortTrigger.dataset.criterion,
              isReverse: sortTrigger.classList.contains('reverse'),
            },
          }),
        );
      };
      this.#sortTriggerHandlers.set(sortTrigger, handleClick);
      sortTrigger.addEventListener('click', handleClick);
    });
  }

  disconnectedCallback() {
    this.#table = null;
    forEach(this.#sortTriggers, (sortTrigger) => {
      const handleClick = this.#sortTriggerHandlers.get(sortTrigger);
      if (handleClick) {
        sortTrigger.removeEventListener('click', handleClick);
      }
    });
    this.#sortTriggers = null;
  }
}
globalThis.customElements.define('albums-table-heading', AlbumsTableHeading);
