import toString from 'lodash/toString';

import { subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import trackPerformance, { PerformancePayload } from './track-performance';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('trackPerf');
  subscription
    .on('message', (message, content, ackOrNack) => {
      const performance: PerformancePayload = content;
      try {
        trackPerformance(performance);
      } catch (error) {
        logger.error(toString(error));
      } finally {
        ackOrNack();
      }
    })
    .on('error', (error) => {
      logger.error(toString(error));
    });
}

main();
