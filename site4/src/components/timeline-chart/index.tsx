import compact from 'lodash/compact';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import minBy from 'lodash/minBy';
import times from 'lodash/times';
import { useEffect, useMemo } from 'react';
import { Area, CartesianGrid, Tooltip } from 'recharts';
import * as usehooks from 'usehooks-ts';

import useIsMobile from '../../hooks/use-is-mobile';
import type { TimelineItem } from '../../services/data/get-timeline';
import formatAlbum from '../../utils/format-album';
import getTrend from '../../utils/get-trend';

import TimelineChartDesktop from './desktop';
import TimelineChartMobile from './mobile';
import TimelineChartTooltip from './tooltip';

import classes from './index.module.css';

const { useElementSize } = usehooks;

export interface TimelineChartProperties {
  timeline: TimelineItem[];
  wrapperWidth?: number;
}
const DOMAIN_UNIT_SIZE = 1000;
const TREND_TIMESPAN = 10;

export default function TimelineChart(properties: TimelineChartProperties) {
  const { timeline } = properties;
  const isMobile = useIsMobile();
  const [wrapperReference, { width: wrapperWidth }] = useElementSize();
  useEffect(() => {
    forEach(timeline, ({ topAlbum }) => {
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
  }, [timeline]);

  const domain = useMemo<[number, number]>(
    () => [
      0,
      DOMAIN_UNIT_SIZE *
        (Math.ceil(Math.max(...map(timeline, 'result')) / DOMAIN_UNIT_SIZE) +
          1),
    ],
    [timeline],
  );

  const trends = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const pastTimeline = map<
      { result: number; year: number },
      [number, number]
    >(
      filter(timeline, ({ year }) => year < currentYear),
      ({ result, year }) => [year, result],
    );
    const firstYear = minBy(pastTimeline, 0)?.[0];
    if (!firstYear || currentYear === firstYear) {
      return [];
    }
    const fullTrend = getTrend(pastTimeline, domain);
    return compact([
      ...times(
        Math.floor((currentYear - firstYear) / TREND_TIMESPAN) - 1,
        (index) => {
          const timespan = TREND_TIMESPAN * (index + 1);
          const trend = getTrend(
            filter(pastTimeline, ([year]) => year >= currentYear - timespan),
            domain,
          );
          return (
            trend && {
              trend,
              label: `Last ${timespan} years trend`,
            }
          );
        },
      ),
      fullTrend && {
        trend: fullTrend,
        label: 'Overall trend',
      },
    ]);
  }, [domain, timeline]);

  const TimelineChartComponent = isMobile
    ? TimelineChartMobile
    : TimelineChartDesktop;
  return (
    <div className={classes.wrapper} ref={wrapperReference}>
      <TimelineChartComponent
        {...properties}
        domain={domain}
        trends={trends}
        wrapperWidth={wrapperWidth}
      >
        <CartesianGrid stroke="#ccc" />
        <Area
          type="step"
          dataKey="result"
          stroke="#8884d8"
          fill="url(#colorResult)"
          fillOpacity={1}
        />
        <Tooltip content={TimelineChartTooltip} />
      </TimelineChartComponent>
    </div>
  );
}
