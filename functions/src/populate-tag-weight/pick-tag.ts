import { WithId } from 'mongodb';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<WithId<TagRecord> | null> {
  return mongoDatabase.tags.findOne({ power: 0 });
}
