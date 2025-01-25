import 'd3-transition';
import { map, reduce } from 'd3-array';
// eslint-disable-next-line import/no-extraneous-dependencies
import { axisBottom, axisLeft } from 'd3-axis';
// eslint-disable-next-line import/no-extraneous-dependencies
import { scaleBand, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { css, html, LitElement, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// set the dimensions and margins of the graph

const MARGIN_COEFFICIENT = 0.1;
const BAR_MIN_WIDTH = 20;
const X_PADDING = 0.2;
const TOOLTIP_APPEAR_DURATION = 200;
const TOOLTIP_TARGET_OPACITY = 0.9;
const TOOLTIP_DISAPPEAR_DURATION = 500;

@customElement('bar-chart')
export default class LitBarChart<T extends object> extends LitElement {
  static override styles = css`
    .tooltip {
      background-color: white;
      position: fixed;
      opacity: 0;
    }
  `;

  @query('.root') declare root: HTMLElement;

  @query('.root svg') declare chart?: SVGSVGElement;

  @query('.tooltip') declare tooltipElement: HTMLElement;

  @property({ type: Array }) declare data: T[];

  // @property({ type: Number }) declare height: number;
  // @property({ type: Number }) declare width: number;
  @property() declare x: keyof T;

  @property() declare y: keyof T;

  @property() declare note: keyof T;

  get tooltip() {
    return select(this.tooltipElement);
  }

  getX = (datum: T): number => {
    return datum[this.x] as number;
  };

  getY = (datum: T): number => {
    return datum[this.y] as number;
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize);
  }

  override disconnectedCallback(): void {
    window.removeEventListener('resize', this.handleResize);
    super.disconnectedCallback();
  }

  handleResize = () => {
    if (this.chart?.parentElement) {
      this.chart.remove();
    }
    this.draw();
  };

  protected override updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    super.updated(_changedProperties);
    this.draw();
  }

  private draw() {
    const { clientHeight, clientWidth, data, getX, note, tooltip } = this;
    const margin = {
      top: clientHeight * MARGIN_COEFFICIENT,
      right: clientWidth * MARGIN_COEFFICIENT,
      bottom: clientHeight * MARGIN_COEFFICIENT,
      left: clientWidth * MARGIN_COEFFICIENT,
    };
    const width =
      Math.max(clientWidth, data.length * BAR_MIN_WIDTH) -
      margin.left -
      margin.right;
    const height = clientHeight - margin.top - margin.bottom;

    const widthWithMargins = width + margin.left + margin.right;
    const heightWithMargins = height + margin.top + margin.bottom;

    // const maxX = reduce(
    //   data,
    //   (accumulator, datum) => Math.max(accumulator, this.getX(datum)),
    //   Number.NEGATIVE_INFINITY,
    // );
    // const minX = reduce(
    //   data,
    //   (accumulator, datum) => Math.min(accumulator, this.getX(datum)),
    //   Number.POSITIVE_INFINITY,
    // );
    const maxY = reduce(
      data,
      (accumulator, datum) => Math.max(accumulator, this.getY(datum)),
      Number.NEGATIVE_INFINITY,
    );
    // const minY = reduce(
    //   data,
    //   (accumulator, datum) => Math.min(accumulator, this.getY(datum)),
    //   0,
    // );

    // append the svg object to the body of the page
    const svg = select<HTMLElement, T>(this.root)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', [0, 0, widthWithMargins, heightWithMargins])
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const xScale = scaleBand<number>()
      .range([0, width])
      .domain(map(data, getX))
      .padding(X_PADDING);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    const yScale = scaleLinear().domain([0, maxY]).range([height, 0]);
    svg.append('g').call(axisLeft(yScale));

    // Bars
    const bars = svg
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (datum) => xScale(this.getX(datum)) || null)
      .attr('y', (datum) => yScale(this.getY(datum)) || null)
      .attr('width', xScale.bandwidth())
      .attr('height', (datum) => {
        return height - yScale(this.getY(datum));
      })
      .attr('fill', '#00d1b2');
    if (note) {
      bars
        .on('mouseover', (event, datum) => {
          tooltip
            .transition()
            .duration(TOOLTIP_APPEAR_DURATION)
            .style('opacity', TOOLTIP_TARGET_OPACITY);
          tooltip
            .html(`${this.getX(datum)}: ${datum[note]}`)
            .style('left', `${event.layerX}px`)
            .style('top', `${event.layerY}px`);
        })
        .on('mouseout', () =>
          tooltip
            .transition()
            .duration(TOOLTIP_DISAPPEAR_DURATION)
            .style('opacity', 0),
        );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  override render() {
    return html`
      <div class="root"></div>
      <div class="tooltip"></div>
    `;
  }
}
