import toString from 'lodash/toString';

import database from '../common/database';
import logToTelegram from '../common/log-to-telegram';
import logger from '../common/logger';

import trainModel from './train';

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await trainModel();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(`FAILURE EXIT REASON: ${toString(error)}`);
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі train2: ${toString(error)}`,
    );
    process.exit(1);
  }
}

process.on('uncaughtException', async (error) => {
  logger.error(`EXCEPTION EXIT REASON: ${toString(error)}`);
  await database.end();
  await logToTelegram(
    `\\#error\nНевідловлений виняток при роботі train2: ${toString(error)}`,
  );
  process.exit(1);
});

main();
