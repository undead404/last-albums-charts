import { WithId } from 'mongodb';
import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default function getTags(): Promise<WithId<TagRecord>[]> {
  return mongoDatabase.tags.find({ topAlbums: { $ne: null } }).toArray();
}
