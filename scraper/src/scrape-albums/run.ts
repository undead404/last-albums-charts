import _ from 'lodash';

import database from '../common/database/index.js';
import logToTelegram from '../common/log-to-telegram.js';
import logger from '../common/logger.js';

import scrapeAlbums from './scrape-albums.js';

const { toString } = _;

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await scrapeAlbums();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(`FAILURE EXIT REASON: ${toString(error)}`);
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі sAlbums: ${toString(error)}`,
    );
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(`EXCEPTION EXIT REASON: ${toString(error)}`);
  await database.end();
  await logToTelegram(
    `\\#error\nНевідловлений виняток при роботі sAlbums: ${toString(error)}`,
  );
  process.exit(1);
});

main();
