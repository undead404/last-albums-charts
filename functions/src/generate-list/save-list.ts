import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, TagRecord } from '../common/types';

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
      },
    );
    return;
  }
  const tagUpdate: Partial<TagRecord> = {
    listCreatedAt: new Date(),
    topAlbums: albums,
  };

  await mongoDatabase.tags.updateOne(
    { name: tagRecord.name },
    { $set: tagUpdate },
  );
}
