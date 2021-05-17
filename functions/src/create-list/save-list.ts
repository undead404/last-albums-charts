import some from 'lodash/some';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, TagRecord } from '../common/types';

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
      chartAlbum.cover !== tagAlbum.cover ||
      chartAlbum.thumbnail !== tagAlbum.thumbnail ||
      chartAlbum.date !== tagAlbum.date
    );
  });
}

export default async function saveList(
  tagRecord: TagRecord,
  albums?: AlbumRecord[],
): Promise<void> {
  if (!albums) {
    logger.debug(`${tagRecord.name}: empty top list`);
    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      {
        $currentDate: {
          listCreatedAt: true,
          listUpdatedAt: true,
        },
        $unset: {
          topAlbums: '',
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
    logger.debug(`${tagRecord.name}: new list!`);
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
