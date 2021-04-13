import toString from 'lodash/toString';

import { publish, subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload } from '../common/types';

import populateAlbumCover from './populate-album-cover';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('populateAlbumCover');
  subscription
    .on('message', async (message, content, ackOrNack) => {
      const album: AlbumAmqpPayload = content;
      const start = new Date();
      try {
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
