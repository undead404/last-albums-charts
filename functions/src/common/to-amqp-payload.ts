import toString from 'lodash/toString';
import { ObjectId, WithId } from 'mongodb';

export type WithStringId<T> = Omit<T, '_id'> & {
  id: string;
};

export default function toAmqpPayload<T>(record: WithId<T>): WithStringId<T> {
  return {
    ...record,
    _id: undefined,
    id:
      record._id instanceof ObjectId
        ? record._id.toHexString()
        : toString(record._id),
  };
}
