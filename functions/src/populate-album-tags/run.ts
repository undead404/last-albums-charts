import { subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import populateAlbumTags, {
  PopulateAlbumTagsPayload,
} from './populate-album-tags';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('populateAlbumTags');
  subscription
    .on('message', (message, content, ackOrNack) => {
      const album: PopulateAlbumTagsPayload = content;
      populateAlbumTags(album)
        .then(() => ackOrNack())
        .catch((error) => logger.error(error));
    })
    .on('error', (error) => {
      logger.error(error);
    });
}

main();
