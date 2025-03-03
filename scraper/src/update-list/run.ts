import database from '../common/database/index.js';
import formatError from '../common/format-error.js';
import logToTelegram from '../common/log-to-telegram.js';
import logger from '../common/logger.js';

import updateList from './update-list.js';

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await updateList();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(`FAILURE EXIT REASON: ${formatError(error)}`);
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі uList: ${formatError(error)}`,
    );
    process.exit(1);
  }
}

process.on('uncaughtException', async (error) => {
  logger.error(`EXCEPTION EXIT REASON: ${formatError(error)}`);
  await database.end();
  await logToTelegram(
    `\\#error\nНевідловлений виняток при роботі uList: ${formatError(error)}`,
  );
  process.exit(1);
});
main();
