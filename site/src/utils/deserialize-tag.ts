import { parseISO } from 'date-fns';

import { SerializedTag, Tag } from '../../types';

export default function deserializeTag<
  T extends Pick<
    SerializedTag,
    'albumsScrapedAt' | 'listCheckedAt' | 'listUpdatedAt' | 'power'
  >
>(
  serializedTag: T,
): Omit<T, 'albumsScrapedAt' | 'listCheckedAt' | 'listUpdatedAt' | 'power'> &
  Pick<Tag, 'albumsScrapedAt' | 'listCheckedAt' | 'listUpdatedAt' | 'power'> {
  return {
    ...serializedTag,
    albumsScrapedAt: serializedTag.albumsScrapedAt
      ? parseISO(serializedTag.albumsScrapedAt)
      : null,
    listCheckedAt: serializedTag.listCheckedAt
      ? parseISO(serializedTag.listCheckedAt)
      : null,
    listUpdatedAt: serializedTag.listUpdatedAt
      ? parseISO(serializedTag.listUpdatedAt)
      : null,
    power: serializedTag.power ? BigInt(serializedTag.power) : null,
  };
}
