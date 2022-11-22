import type { TimelineChartProperties } from '.';
import map from 'lodash/map';
import { ReactNode, useMemo } from 'react';
import { Area, AreaChart, ReferenceLine, XAxis, YAxis } from 'recharts';
import type { AxisDomain, Margin } from 'recharts/types/util/types';
import * as usehooks from 'usehooks-ts';

const { useWindowSize } = usehooks;

const MARGIN: Margin = { left: 0 };

const HEIGHT_MULTIPLIER = 1;

const currentDate = new Date();
const MONTHS_IN_YEAR = 12;
const DAYS_IN_YEAR = 365.25;
const currentExactYear =
  currentDate.getFullYear() +
  currentDate.getMonth() / MONTHS_IN_YEAR +
  (currentDate.getDate() - 1) / DAYS_IN_YEAR;

export default function TimelineChartMobile({
  children,
  domain,
  timeline,
  trends,
  wrapperWidth,
}: TimelineChartProperties & {
  children: ReactNode;
  domain: AxisDomain;
  trends: { label: string; trend: { x: number; y: number }[] }[];
}) {
  const { height: windowHeight } = useWindowSize();
  const transposedTrends = useMemo(
    () =>
      map(trends, (trend) => ({
        ...trend,
        trend: map(trend.trend, ({ x, y }) => ({ x: y, y: x })),
      })),
    [trends],
  );
  return (
    <AreaChart
      data={timeline}
      height={windowHeight * HEIGHT_MULTIPLIER}
      layout="vertical"
      margin={MARGIN}
      width={wrapperWidth}
    >
      <defs>
        <linearGradient id="colorResult" y1="0" x1="1" y2="0" x2="0">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="step"
        dataKey="result"
        stroke="#8884d8"
        fill="url(#colorResult)"
        fillOpacity={1}
      />
      <XAxis domain={domain} type="number" />
      <YAxis dataKey="year" scale="time" type="category" reversed />
      {map(
        transposedTrends,
        ({ label, trend }, index, { length: numberOfTrends }) => (
          <ReferenceLine
            key={label}
            label={label}
            stroke="green"
            strokeDasharray="3 3"
            strokeWidth={numberOfTrends - index}
            segment={trend}
          />
        ),
      )}
      <ReferenceLine y={currentExactYear} stroke="blue" label="Now" />
      {children}
    </AreaChart>
  );
}
