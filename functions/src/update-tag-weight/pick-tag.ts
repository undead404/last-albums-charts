import head from 'lodash/head';
import toInteger from 'lodash/toInteger';
import { FilterQuery, WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

const QUERY: FilterQuery<WithId<TagRecord>> = { power: { $ne: 0 } };

export default async function pickTag(): Promise<WithId<TagRecord> | null> {
  const numberOfTags = await mongoDatabase.tags.countDocuments(QUERY);
  // logger.debug(`${numberOfTags} tags present`);
  const indexToPick = toInteger(Math.random() * numberOfTags);
  return (
    head(
      // eslint-disable-next-line unicorn/no-array-callback-reference
      await mongoDatabase.tags.find(QUERY).skip(indexToPick).limit(1).toArray(),
    ) || null
  );
}
