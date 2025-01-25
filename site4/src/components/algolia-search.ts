import algoliaStyles from 'instantsearch.css/themes/satellite-min.css?inline';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';
import { hits, searchBox } from 'instantsearch.js/es/widgets';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import searchClient from '../services/algolia';

const numberFormat = new Intl.NumberFormat();
export const tagName = 'algolia-search';

@customElement('algolia-search')
export default class Search extends LitElement {
  static override styles = [
    unsafeCSS(algoliaStyles),
    css`
      :host {
        position: relative;
      }
      :host([isopen='true']) .hits {
        display: block;
      }
      .hits {
        position: absolute;
        display: none;
        max-height: 50vh;
        overflow-y: auto;
        border: 1px solid grey;
        z-index: 1;
        right: 0;
        width: 100%;
      }
      .ais-Hits {
        background-color: white;
      }
      .ais-Hits-item {
        padding: 0;
      }
      .aa-ItemLink,
      .ais-Hits--empty {
        display: block;
        padding: 1rem;
        width: 100%;
      }
    `,
  ];

  @query('.searchbox', true) declare searchbox: HTMLElement;

  @query('.hits', true) declare hits: HTMLElement;

  @property({ reflect: true }) private declare isOpen: boolean;

  private declare search: InstantSearch;

  constructor() {
    super();
    this.search = new InstantSearch({
      indexName: 'tags',
      searchClient,
    });
    this.isOpen = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.search.addWidgets([
      searchBox({
        container: this.searchbox,
        // queryHook: (queryValue, hook) => {
        //   this.open = true;
        //   hook(queryValue);
        // },
      }),
      hits({
        container: this.hits,
        templates: {
          item: (
            hit,
            { html: algoliaHtml, components },
          ) => algoliaHtml`<a href="/tag/${encodeURIComponent(
            hit.name,
          )}" class="aa-ItemLink">
          <div class="aa-ItemContent">
            <div class="aa-ItemTitle">
              <strong>${components.Highlight({
                hit,
                attribute: 'name',
              })}</strong> (
              <small>
                ${numberFormat.format(Number.parseInt(`${hit.weight}`, 10))}
              </small>
              )
            </div>
          </div>
        </a>`,
        },
      }),
    ]);
    this.search.start();
    this.addEventListener('click', (event) => {
      event.stopPropagation();
      this.open();
    });
    window.addEventListener('click', this.close);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this.close);
  }

  close = () => {
    this.isOpen = false;
  };

  open = () => {
    this.isOpen = true;
  };

  // eslint-disable-next-line class-methods-use-this
  override render() {
    return html`
      <div class="searchbox"></div>
      <div class="hits"></div>
    `;
  }
}
