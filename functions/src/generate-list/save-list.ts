import { UpdateWriteOpResult, WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, TagRecord } from '../common/types';

export default function saveList(
  tagRecord: TagRecord,
  albums?: WithId<AlbumRecord>[],
): Promise<UpdateWriteOpResult> {
  if (!albums) {
    return mongoDatabase.tags.updateOne(
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
  }
  const tagUpdate: Partial<TagRecord> = {
    listCreatedAt: new Date(),
    topAlbums: albums,
  };

  return mongoDatabase.tags.updateOne(
    { name: tagRecord.name },
    { $set: tagUpdate },
  );
}
