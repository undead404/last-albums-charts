import map from 'lodash/map';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload } from '../common/types';

const LIMIT_FOR_ONE_SHOT = 100;

export default async function fixAlbums(): Promise<void> {
  logger.debug('fixAlbums()');
  const albums = await mongoDatabase.albums
    .find<AlbumAmqpPayload>(
      {
        $or: [
          {
            $and: [
              {
                cover: {
                  $exists: false,
                },
              },
              {
                thumbnail: {
                  $exists: false,
                },
              },
            ],
          },
          {
            date: {
              $exists: false,
            },
          },
          {
            listeners: null,
          },
          {
            tags: null,
          },
        ],
      },
      { projection: { _id: false, artist: true, mbid: true, name: true } },
    )
    .limit(LIMIT_FOR_ONE_SHOT)
    .toArray();
  logger.debug(`fixAlbums: ${albums.length} albums found to fix`);
  await Promise.all(map(albums, (album) => publish('newAlbums', album)));
}
