import { publish } from '../common/amqp-broker';
import mongoDatabase from '../common/mongo-database';

import fixAlbums from './fix-albums';

export default async function main(): Promise<void> {
  const start = new Date();
  try {
    if (!mongoDatabase.isConnected) {
      await mongoDatabase.connect();
    }
    await fixAlbums();
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: `some albums`,
      title: 'fixAlbums',
    });
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: `some albums`,
      title: 'fixAlbums',
    });
    throw error;
  }
}

main();
