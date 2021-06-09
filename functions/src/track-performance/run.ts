import toString from 'lodash/toString';

import { subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import prisma from '../common/prisma';

import trackPerformance, { PerformancePayload } from './track-performance';

export default async function main(): Promise<void> {
  await prisma.$connect();
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
async function handleExit(): Promise<void> {
  await prisma.$disconnect();
}
process.on('exit', handleExit);

// catches ctrl+c event
process.on('SIGINT', handleExit);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', handleExit);
process.on('SIGUSR2', handleExit);

process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await prisma.$disconnect();
  process.exit(1);
});

main();
