import toInteger from 'lodash/toInteger';
import createElement from '../utils/create-element';

import getNextId from '../utils/get-next-id';

const HSL_SATURATION_CEILING = 101;
const BLACK_TAG_TEXT_CHANGE_BORDER = 50;

export default class AlbumTag extends HTMLElement {
  connectedCallback() {
    const { tagName, value: valueString } = this.dataset;
    if (!valueString || !tagName) {
      throw new Error('Wrong arguments');
    }
    const value = toInteger(valueString);

    const aElement = createElement('a', {
      attributes: { href: `/tag/${encodeURIComponent(tagName)}` },
      classes: ['tag', 'is-black'],
      style: {
        backgroundColor: `hsl(0, 0%, ${HSL_SATURATION_CEILING - value}%)`,
        color: value > BLACK_TAG_TEXT_CHANGE_BORDER ? 'white' : 'black',
        display: 'flex',
        gap: '1em',
      },
    });

    const meterId = getNextId();

    const labelElement = createElement('label', {
      attributes: {
        for: meterId,
      },
      textContent: tagName,
    });
    aElement.append(labelElement);

    const meterElement = createElement('meter', {
      attributes: {
        id: meterId,
        low: '50',
        max: '100',
        min: '0',
        optimum: '100',
        value: valueString,
      },
      textContent: `${valueString}%`,
    });
    aElement.append(meterElement);

    this.append(aElement);
  }
}

globalThis.customElements.define('album-tag', AlbumTag);
