import numbro from 'numbro';
import { memo } from 'react';
import type { TooltipProps } from 'recharts';

import type { TimelineItem } from '../../services/data/get-timeline';
import formatAlbum from '../../utils/format-album';

export interface TimelineChartTooltipProperties {
  payload: TimelineItem[];
}

function TimelineChartTooltip({
  payload: [{ payload } = { payload: null }] = [],
}: TooltipProps<string, number>) {
  if (!payload) {
    return null;
  }
  if (!payload?.result) {
    return (
      <div className="message">
        <div className="message-header">{payload.year}</div>
        <div className="message-body">Nothing</div>
      </div>
    );
  }
  return (
    <div className="message">
      <div className="message-header">
        <p>{payload.year}</p>
      </div>
      <div className="message-body">
        <p>
          Result:{' '}
          {numbro(payload.result).format({
            mantissa: 2,
            thousandSeparated: true,
          })}
        </p>
        <p>
          Most prominent album:{' '}
          {payload.topAlbum ? formatAlbum(payload.topAlbum) : 'None'}
        </p>
      </div>
    </div>
  );
}

// This component cannot be wrapped with React.memo
export default TimelineChartTooltip;
