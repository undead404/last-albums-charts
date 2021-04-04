import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import getAlbumTopTags from '../common/lastfm/get-album-top-tags';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload, AlbumRecord } from '../common/types';

import normalizeTags from './normalize-tags';

export default async function populateAlbumTags(
  album: AlbumAmqpPayload,
): Promise<void> {
  logger.info(`populateAlbumTags: ${album.artist} - ${album.name}`);
  const tagsObjects = await getAlbumTopTags(album.name, album.artist);
  const tags = normalizeTags(tagsObjects);
  const albumUpdate: Partial<AlbumRecord> = { tags };
  await mongoDatabase.albums.updateOne(
    { artist: album.artist, name: album.name },
    { $set: albumUpdate },
  );
  if (!isEmpty(tags)) {
    await mongoDatabase.tags.bulkWrite(
      map(tags, (tagCount, tagName) => ({
        updateOne: {
          filter: {
            name: tagName,
          },
          update: {
            $setOnInsert: {
              lastProcessedAt: null,
              listCreatedAt: null,
              name: tagName,
              power: 0,
            },
          },
          upsert: true,
        },
      })),
      {
        ordered: false,
      },
    );
  }
}
