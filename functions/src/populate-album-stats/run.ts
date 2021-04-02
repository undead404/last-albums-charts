import toString from 'lodash/toString';

import { subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import populateAlbumStats, {
  PopulateAlbumStatsPayload,
} from './populate-album-stats';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('populateAlbumStats');
  subscription
    .on('message', (message, content, ackOrNack) => {
      const album: PopulateAlbumStatsPayload = content;
      populateAlbumStats(album)
        .then(() => ackOrNack())
        .catch((error) => logger.error(toString(error)));
    })
    .on('error', (error) => {
      logger.error(toString(error));
    });
}

main();
