import { parseISO } from 'date-fns';
import { SerializedTag, Tag } from 'types';

export default function deserializeTag(serializedTag: SerializedTag): Tag {
  return {
    ...serializedTag,
    lastProcessedAt: serializedTag.lastProcessedAt
      ? parseISO(serializedTag.lastProcessedAt)
      : null,
    listCreatedAt: serializedTag.listCreatedAt
      ? parseISO(serializedTag.listCreatedAt)
      : null,
  };
}
