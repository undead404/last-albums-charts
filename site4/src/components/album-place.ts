import toInteger from 'lodash/toInteger';
import createElement from '../utils/create-element';

const HSL_SATURATION_CEILING = 101;
const GOLD_TAG_TEXT_CHANGE_BORDER = 75;

export default class AlbumPlace extends HTMLElement {
  connectedCallback() {
    const { tagName, place: placeString } = this.dataset;
    if (!placeString || !tagName) {
      throw new Error('Wrong arguments');
    }
    const place = toInteger(placeString);
    const aElement = createElement('a', {
      attributes: {
        href: `/tag/${encodeURIComponent(tagName)}`,
      },
      classes: ['tag', 'is-black'],
      style: {
        backgroundColor: `hsl(51, ${HSL_SATURATION_CEILING - place}%, 50%)`,
        color: place >= GOLD_TAG_TEXT_CHANGE_BORDER ? 'white' : 'black',
      },
      textContent: `${tagName} #${place}`,
    });
    this.append(aElement);
  }
}

globalThis.customElements.define('album-place', AlbumPlace);
