import head from 'lodash/head';
import toInteger from 'lodash/toInteger';
import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<WithId<TagRecord> | null> {
  const numberOfTags = await mongoDatabase.tags.countDocuments();
  const indexToPick = toInteger(Math.random() * numberOfTags);
  return (
    head(
      await mongoDatabase.tags
        .find({ power: { $ne: 0 } })
        .skip(indexToPick)
        .limit(1)
        .toArray(),
    ) || null
  );
}
