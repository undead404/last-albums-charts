import head from 'lodash/head';
import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<WithId<TagRecord> | null> {
  let tag = await mongoDatabase.tags.findOne({ power: 0 });
  if (tag) {
    return tag;
  }
  tag =
    head(
      await mongoDatabase.tags.aggregate([{ $sample: { size: 1 } }]).toArray(),
    ) || null;
  return tag;
}
