import toString from 'lodash/toString';

import logger from '../common/logger';
import prisma from '../common/prisma';

import scrapeAlbums from './scrape-albums';

export default async function main(): Promise<void> {
  try {
    await prisma.$connect();
    await scrapeAlbums();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error(toString(error));
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
