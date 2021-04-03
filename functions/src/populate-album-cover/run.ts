import toString from 'lodash/toString';

import { publish, subscribe } from '../common/amqp-broker';
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
    .on('message', async (message, content, ackOrNack) => {
      const album: PopulateAlbumCoverPayload = content;
      const start = new Date();
      try {
        if (!album.mbid) {
          logger.warn('This album got no MusicBrainz ID');
          return;
        }
        await populateAlbumCover(album);
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: true,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumCover',
        });
      } catch (error) {
        logger.error(toString(error));
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: false,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumCover',
        });
      } finally {
        ackOrNack();
      }
    })
    .on('error', (error) => {
      logger.error(toString(error));
    });
}

main();
