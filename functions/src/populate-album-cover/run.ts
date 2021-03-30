import { subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import populateAlbumCover, {
  PopulateAlbumCoverPayload,
} from './populate-album-cover';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('populateAlbumCover');
  subscription
    .on('message', (message, content, ackOrNack) => {
      const album: PopulateAlbumCoverPayload = content;
      if (!album.mbid) {
        logger.warn('This album got no MusicBrainz ID');
        ackOrNack();
        return;
      }
      populateAlbumCover(album)
        .then(() => ackOrNack())
        .catch(logger.error);
    })
    .on('error', (error) => {
      logger.error(error);
    });
}

main();
