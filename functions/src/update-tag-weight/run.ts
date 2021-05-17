import toString from 'lodash/toString';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import updateTagWeight from './update-tag-weight';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  try {
    await updateTagWeight();
    process.exit(0);
  } catch (error) {
    logger.error(toString(error));
    process.exit(1);
  }
}

main();
