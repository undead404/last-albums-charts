import head from 'lodash/head';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<TagRecord | null> {
  let [tag]: (TagRecord | undefined)[] = await mongoDatabase.tags
    .find({
      lastProcessedAt: null,
    })
    .sort({
      power: -1,
    })
    .limit(1)
    .toArray();
  if (!tag) {
    tag = head(
      await mongoDatabase.tags
        .find({})
        .sort({
          lastProcessedAt: 1,
        })
        .limit(1)
        .toArray(),
    );
  }
  return tag || null;
}
