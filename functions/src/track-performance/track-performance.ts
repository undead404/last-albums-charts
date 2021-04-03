import { formatDuration, intervalToDuration, parseISO } from 'date-fns';

import logger from '../common/logger';

export interface PerformancePayload {
  end: string;
  start: string;
  success: boolean;
  targetName: string;
  title: string;
}

export default function trackPerformance(payload: PerformancePayload): void {
  const start = parseISO(payload.start);
  const end = parseISO(payload.end);
  logger.info(
    `${payload.title} ${payload.success ? 'success' : 'failure'}: ${
      payload.targetName
    } - ${formatDuration(intervalToDuration({ end, start }))}`,
  );
}
