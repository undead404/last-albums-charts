import head from 'lodash/head';
import toInteger from 'lodash/toInteger';
import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<WithId<TagRecord> | null> {
  let tag = await mongoDatabase.tags.findOne({ power: 0 });
  if (tag) {
    return tag;
  }
  const numberOfTags = await mongoDatabase.tags.countDocuments();
  const indexToPick = toInteger(Math.random() * numberOfTags);
  tag =
    head(
      await mongoDatabase.tags
        .find({ power: 0 })
        .skip(indexToPick)
        .limit(1)
        .toArray(),
    ) || null;
  return tag;
}
