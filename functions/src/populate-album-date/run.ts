import toString from 'lodash/toString';

import { publish, subscribe } from '../common/amqp-broker';
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
    .on('message', async (message, content, ackOrNack) => {
      const album: PopulateAlbumDatePayload = content;
      const start = new Date();
      try {
        if (!album.mbid) {
          logger.warn('This album got no MusicBrainz ID');
          return;
        }
        await populateAlbumDate(album);
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: true,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumDate',
        });
      } catch (error) {
        logger.error(toString(error));
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: false,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumDate',
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
