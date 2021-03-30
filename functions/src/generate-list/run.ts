import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import generateList from './generate-list';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  generateList().catch(logger.error);
}

main();
