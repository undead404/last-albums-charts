import type { TimelineChartProperties } from '.';
import map from 'lodash/map';
import type { ReactNode } from 'react';
import { AreaChart, ReferenceLine, XAxis, YAxis } from 'recharts';
import type { AxisDomain, Margin } from 'recharts/types/util/types';
import * as usehooks from 'usehooks-ts';

const { useWindowSize } = usehooks;

const MARGIN: Margin = { left: 60 };

const HEIGHT_SUBTRACTION = 300;

const currentDate = new Date();
const MONTHS_IN_YEAR = 12;
const DAYS_IN_YEAR = 365.25;
const currentExactYear =
  currentDate.getFullYear() +
  currentDate.getMonth() / MONTHS_IN_YEAR +
  (currentDate.getDate() - 1) / DAYS_IN_YEAR;

export default function TimelineChartDesktop({
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
  return (
    <AreaChart
      data={timeline}
      height={windowHeight - HEIGHT_SUBTRACTION}
      margin={MARGIN}
      width={wrapperWidth}
    >
      <defs>
        <linearGradient id="colorResult" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="year" scale="time" type="category" />
      <YAxis domain={domain} type="number" />
      {map(trends, ({ label, trend }, index, { length: numberOfTrends }) => (
        <ReferenceLine
          key={JSON.stringify(trend)}
          label={label}
          stroke="green"
          strokeDasharray="3 3"
          strokeWidth={numberOfTrends - index}
          segment={trend}
        />
      ))}
      <ReferenceLine x={currentExactYear} stroke="blue" label="Now" />
      {children}
    </AreaChart>
  );
}
