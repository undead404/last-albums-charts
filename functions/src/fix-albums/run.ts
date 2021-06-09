import toString from 'lodash/toString';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import prisma from '../common/prisma';

import fixAlbums from './fix-albums';

export default async function main(): Promise<void> {
  const start = new Date();
  try {
    await prisma.$connect();
    await fixAlbums();
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: `some albums`,
      title: 'fixAlbums',
    });
    await prisma.$disconnect();
    process.exit(0);
  } catch {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: `some albums`,
      title: 'fixAlbums',
    });
    await prisma.$disconnect();
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await prisma.$disconnect();
  process.exit(1);
});

main();
