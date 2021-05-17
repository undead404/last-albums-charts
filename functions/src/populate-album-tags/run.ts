import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';

import { publish, subscribe } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload } from '../common/types';

import populateAlbumTags from './populate-album-tags';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  const subscription = await subscribe('populateAlbumTags');
  subscription
    .on('message', async (message, content, ackOrNack) => {
      const album: AlbumAmqpPayload = content;
      const start = new Date();
      try {
        const albumRecord = await (album.mbid
          ? mongoDatabase.albums.findOne({ mbid: album.mbid })
          : mongoDatabase.albums.findOne({
              artist: album.artist,
              name: album.name,
            }));
        if (!isEmpty(albumRecord?.tags)) {
          return;
        }
        await populateAlbumTags(album);
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: true,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumStats',
        });
      } catch (error) {
        logger.error(toString(error));
        await publish('perf', {
          end: new Date().toISOString(),
          start: start.toISOString(),
          success: false,
          targetName: `${album.artist} - ${album.name}`,
          title: 'populateAlbumStats',
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
