import toString from 'lodash/toString';

import database from '../common/database';
import logger from '../common/logger';

import createList from './create-list';

export default async function main(): Promise<void> {
  try {
    await database.connect();
    await createList();
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(`FAILURE EXIT REASON: ${toString(error)}`);
    await database.end();
    process.exit(1);
  }
}

process.on('uncaughtException', async (error) => {
  logger.error(`EXCEPTION EXIT REASON: ${toString(error)}`);
  await database.end();
  process.exit(1);
});

main();
