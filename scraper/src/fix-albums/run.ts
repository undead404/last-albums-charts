import toString from 'lodash/toString';

import database from '../common/database';
import logToTelegram from '../common/log-to-telegram';
import logger from '../common/logger';

import fixAlbums from './fix-albums';

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await fixAlbums();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(`FAILURE EXIT REASON: ${toString(error)}`);
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі fAlbums: ${toString(error)}`,
    );
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(`EXCEPTION EXIT REASON: ${toString(error)}`);
  await database.end();
  await logToTelegram(
    `\\#error\nНевідловлений виняток при роботі fAlbums: ${toString(error)}`,
  );
  process.exit(1);
});

main();
