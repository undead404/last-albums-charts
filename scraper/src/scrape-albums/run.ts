import toString from 'lodash/toString';

import database from '../common/database';
import logger from '../common/logger';

import scrapeAlbums from './scrape-albums';

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await scrapeAlbums();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(toString(error));
    await database.end();
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await database.end();
  process.exit(1);
});

main();
