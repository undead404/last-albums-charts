import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, TagRecord } from '../common/types';

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
    return;
  }
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
