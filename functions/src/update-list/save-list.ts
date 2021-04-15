import some from 'lodash/some';
import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, TagRecord } from '../common/types';

function didAlbumsChange(
  tagRecord: TagRecord,
  albums?: WithId<AlbumRecord>[],
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
      chartAlbum.name !== tagAlbum.name
    );
  });
}

export default async function saveList(
  tagRecord: TagRecord,
  albums?: WithId<AlbumRecord>[],
): Promise<void> {
  if (!albums) {
    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      {
        $set: {
          listCreatedAt: new Date(),
        },
        $unset: {
          topAlbums: '',
        },
      },
    );
  } else if (!didAlbumsChange(tagRecord, albums)) {
    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      {
        $set: {
          listCreatedAt: new Date(),
        },
      },
    );
  } else {
    const tagUpdate: Partial<TagRecord> = {
      listCreatedAt: new Date(),
      topAlbums: albums,
    };

    await mongoDatabase.tags.updateOne(
      { name: tagRecord.name },
      { $set: tagUpdate },
    );
  }
}
