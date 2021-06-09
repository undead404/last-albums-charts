import toString from 'lodash/toString';

import { publish, subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import prisma from '../common/prisma';
import { AlbumAmqpPayload } from '../common/types';

import populateAlbumStats from './populate-album-stats';

export default async function main(): Promise<void> {
  await prisma.$connect();
  const subscription = await subscribe('populateAlbumStats');
  subscription
    .on('message', async (message, content, ackOrNack) => {
      const album: AlbumAmqpPayload = content;
      const start = new Date();
      try {
        await populateAlbumStats(album);
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: true,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumStats',
        });
      } catch (error) {
        logger.error(toString(error));
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: false,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumStats',
        });
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
