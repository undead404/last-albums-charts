import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import map from 'lodash/map';

import './bar-chart';

import type { TimelineItem } from '../services/data/get-timeline';
import formatAlbum from '../utils/format-album';

export const tagName = 'timeline-chart';

@customElement(tagName)
export default class TimelineChart extends LitElement {
  static override styles = css`
    bar-chart {
      display: block;
      height: min(75vh, 500px);
      width: max(100%, 600px);
    }
    .root {
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
    }
  `;

  @property({ type: Array }) declare timeline: TimelineItem[];

  override connectedCallback(): void {
    super.connectedCallback();
    forEach(this.timeline, ({ topAlbum }) => {
      if (!topAlbum) {
        return;
      }
      if (isNil(topAlbum.numberOfTracks)) {
        // eslint-disable-next-line no-console
        console.warn(formatAlbum(topAlbum), 'number of tracks unknown');
      } else {
        // eslint-disable-next-line no-console
        console.debug(
          formatAlbum(topAlbum),
          'number of tracks',
          topAlbum.numberOfTracks,
        );
      }
    });
  }

  override render() {
    return html`
      <div class="root">
        <bar-chart
          data="${JSON.stringify(
            map(this.timeline, (timelineItem) => ({
              note: timelineItem.topAlbum
                ? formatAlbum(timelineItem.topAlbum, true)
                : null,
              result: timelineItem.result,
              year: timelineItem.year,
            })),
          )}"
          note="note"
          x="year"
          y="result"
        ></bar-chart>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'timeline-chart': TimelineChart;
  }
}
