import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<WithId<TagRecord> | null> {
  return (
    (await mongoDatabase.tags.findOne({
      power: 0,
      topAlbums: { $ne: null },
      // eslint-disable-next-line no-return-await
    })) || (await mongoDatabase.tags.findOne({ power: 0 }))
  );
}
