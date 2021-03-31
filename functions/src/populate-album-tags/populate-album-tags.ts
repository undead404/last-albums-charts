import map from 'lodash/map';

import getAlbumTopTags from '../common/lastfm/get-album-top-tags';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, SerializableAlbum } from '../common/types';

import normalizeTags from './normalize-tags';

export type PopulateAlbumTagsPayload = Pick<
  SerializableAlbum,
  'artist' | 'name'
>;

export default async function populateAlbumTags(
  album: PopulateAlbumTagsPayload,
): Promise<void> {
  logger.info(`populateAlbumTags: ${album.artist} - ${album.name}`);
  const tagsObjects = await getAlbumTopTags(album.name, album.artist);
  const tags = normalizeTags(tagsObjects);
  const albumUpdate: Partial<AlbumRecord> = { tags };
  await mongoDatabase.albums.updateOne(
    { artist: album.artist, name: album.name },
    { $set: albumUpdate },
  );
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
