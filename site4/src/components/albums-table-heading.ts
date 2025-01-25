import classNames from 'classnames';
import { css, html, LitElement, svg } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import forEach from 'lodash/forEach';

export const tagName = 'albums-table-heading';
@customElement(tagName)
export default class AlbumsTableHeading extends LitElement {
  @queryAll('button') declare buttons!: HTMLButtonElement[];

  @property() declare sortCriterion: string;

  @property() declare sortOrder: string;

  static override styles = css`
    :host {
      display: table-header-group;
    }
    .tr {
      display: table-row;
    }
    .th {
      display: table-cell;
      text-align: center;
      border-bottom: 1px solid grey;
    }
    .button {
      align-items: center;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      background-color: white;
      border: none;
      width: 100%;
      height: 100%;
    }
    svg {
      display: none;
    }
    .active svg {
      display: initial;
    }
    :host([sortOrder='desc']) svg {
      transform: rotate(180deg);
    }
  `;

  constructor() {
    super();
    this.sortCriterion = 'date';
    this.sortOrder = 'asc';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    forEach(this.buttons, (button) => {
      button.addEventListener('click', this.handleClick as EventListener);
    });
  }

  override disconnectedCallback(): void {
    forEach(this.buttons, (button) => {
      button.removeEventListener('click', this.handleClick as EventListener);
    });
    super.disconnectedCallback();
  }

  handleClick = (event: MouseEvent) => {
    const criterion = (event.target as HTMLElement)?.dataset?.criterion;
    if (!criterion) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent('sort', {
        bubbles: true,
        composed: true,
        detail: {
          criterion,
          isReverse:
            this.sortCriterion === criterion ? this.sortOrder === 'asc' : false,
        },
      }),
    );
  };

  static renderIcon() {
    const svgIcon = svg`
      <path d="M24 22h-24l12-20z"></path>
    `;
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
    >
      ${svgIcon}
    </svg>`;
  }

  override render() {
    return html`
      <div class="tr">
        <div class="th" scope="col">
          <button
            class="${classNames('button', {
              active: this.sortCriterion === 'place',
            })}"
            data-criterion="place"
          >
            #${AlbumsTableHeading.renderIcon()}
          </button>
        </div>
        <div class="th" scope="col">
          <button
            class="${classNames('button', {
              active: this.sortCriterion === 'album',
            })}"
            data-criterion="album"
          >
            Album${AlbumsTableHeading.renderIcon()}
          </button>
        </div>
        <div class="th" scope="col">
          <button
            class="${classNames('button', {
              active: this.sortCriterion === 'date',
            })}"
            data-criterion="date"
          >
            Date${AlbumsTableHeading.renderIcon()}
          </button>
        </div>
        <div aria-label="Cover thumbnail" class="th" scope="col"></div>
      </div>
    `;
  }
}
