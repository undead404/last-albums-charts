import database from '../common/database/index.js';
import formatError from '../common/format-error.js';
import logToTelegram from '../common/log-to-telegram.js';
import logger from '../common/logger.js';

import fixAlbums from './fix-albums.js';

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await fixAlbums();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(`FAILURE EXIT REASON: ${formatError(error)}`);
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі fAlbums: ${formatError(error)}`,
    );
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(`EXCEPTION EXIT REASON: ${formatError(error)}`);
  await database.end();
  await logToTelegram(
    `\\#error\nНевідловлений виняток при роботі fAlbums: ${formatError(error)}`,
  );
  process.exit(1);
});

main();
