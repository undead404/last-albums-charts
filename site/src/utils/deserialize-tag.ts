import { parseISO } from 'date-fns';

export default function deserializeTag<
  T extends {
    lastProcessedAt: null | string;
    listCreatedAt: null | string;
    listUpdatedAt?: string;
  }
>(
  serializedTag: T,
): Omit<T, 'lastProcessedAt' | 'listCreatedAt' | 'listUpdatedAt'> & {
  lastProcessedAt: null | Date;
  listCreatedAt: null | Date;
  listUpdatedAt?: Date;
} {
  return {
    ...serializedTag,
    lastProcessedAt: serializedTag.lastProcessedAt
      ? parseISO(serializedTag.lastProcessedAt)
      : null,
    listCreatedAt: serializedTag.listCreatedAt
      ? parseISO(serializedTag.listCreatedAt)
      : null,
    listUpdatedAt: serializedTag.listUpdatedAt
      ? parseISO(serializedTag.listUpdatedAt)
      : undefined,
  };
}
