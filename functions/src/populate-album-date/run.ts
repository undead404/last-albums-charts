import toString from 'lodash/toString';

import { subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import populateAlbumDate, {
  PopulateAlbumDatePayload,
} from './populate-album-date';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('populateAlbumDate');
  subscription
    .on('message', (message, content, ackOrNack) => {
      const album: PopulateAlbumDatePayload = content;
      populateAlbumDate(album)
        .then(() => ackOrNack())
        .catch((error) => logger.error(toString(error)));
    })
    .on('error', (error) => {
      logger.error(toString(error));
    });
}

main();
