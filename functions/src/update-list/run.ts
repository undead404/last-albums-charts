import toString from 'lodash/toString';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import updateList from './update-list';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  try {
    await updateList();
    process.exit(0);
  } catch (error) {
    logger.error(toString(error));
    process.exit(1);
  }
}

main();
