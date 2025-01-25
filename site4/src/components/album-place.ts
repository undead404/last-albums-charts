import classNames from 'classnames';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

const HSL_SATURATION_CEILING = 101;
const GOLD_TAG_TEXT_CHANGE_BORDER = 75;

@customElement('album-place')
export default class AlbumPlace extends LitElement {
  static override styles = css`
    a {
      display: flex;
      font-size: 0.75rem;
      gap: 1rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      white-space: nowrap;
      line-height: 0.75rem;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    a.inverted {
      color: #ffff11;
    }
    a.inverted:visited {
      color: #aae574;
    }
  `;

  @property({
    type: Number,
  })
  declare place: number;

  @property() declare tag: string;

  constructor() {
    super();
    this.place = 0;
    this.tag = '';
  }

  get customStyle() {
    return {
      backgroundColor: `hsl(51, ${HSL_SATURATION_CEILING - this.place}%, 50%)`,
    };
  }

  override render() {
    return html`
      <a
        class="${classNames({
          inverted: this.place >= GOLD_TAG_TEXT_CHANGE_BORDER,
        })}"
        href="/tag/${encodeURIComponent(this.tag)}"
        style="${styleMap(this.customStyle)}"
        >${this.tag} #${this.place}</a
      >
    `;
  }
}
