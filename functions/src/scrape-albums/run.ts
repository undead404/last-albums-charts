import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import scrapeAlbums from './scrape-albums';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  scrapeAlbums().catch((error) => logger.error(error));
}

main();
