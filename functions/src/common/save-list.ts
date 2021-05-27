import some from 'lodash/some';

import logger from './logger';
import mongoDatabase from './mongo-database';
import { AlbumRecord, TagRecord } from './types';

function didAlbumsChange(
  tagRecord: TagRecord,
  albums?: AlbumRecord[],
): boolean {
  if (!albums && !tagRecord.topAlbums) {
    return false;
  }
  if (!albums || !tagRecord.topAlbums) {
    return true;
  }
  return some(albums, (chartAlbum, index) => {
    const tagAlbum = tagRecord.topAlbums?.[index];
    return (
      !tagAlbum ||
      chartAlbum.artist !== tagAlbum.artist ||
      chartAlbum.name !== tagAlbum.name ||
      // chartAlbum.cover !== tagAlbum.cover ||
      // chartAlbum.thumbnail !== tagAlbum.thumbnail ||
      chartAlbum.date !== tagAlbum.date
    );
  });
}
export default async function saveList(
  tagRecord: TagRecord,
  albums?: AlbumRecord[],
): Promise<void> {
  if (!albums) {
    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      {
        $currentDate: {
          listCreatedAt: true,
          listUpdatedAt: true,
        },
      },
    );
  } else if (!didAlbumsChange(tagRecord, albums)) {
    logger.debug(`${tagRecord.name}: no changes`);
    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      {
        $currentDate: {
          listCreatedAt: true,
        },
      },
    );
  } else {
    const tagUpdate: Partial<TagRecord> = {
      topAlbums: albums,
    };

    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      {
        $currentDate: {
          listCreatedAt: true,
          listUpdatedAt: true,
        },
        $set: tagUpdate,
      },
    );
  }
}
