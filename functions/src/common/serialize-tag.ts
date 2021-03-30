import { formatISO } from 'date-fns';
import map from 'lodash/map';
import { WithId } from 'mongodb';
import serializeAlbum from './serialize-album';

import {
  AlbumRecord,
  SerializableAlbum,
  SerializableTag,
  TagRecord,
} from './types';

export default function serializeTag(tag: WithId<TagRecord>): SerializableTag {
  const serializedTag: SerializableTag = {
    ...tag,
    id: tag._id.toHexString(),
    lastProcessedAt: tag.lastProcessedAt
      ? formatISO(tag.lastProcessedAt)
      : null,
    listCreatedAt: tag.listCreatedAt ? formatISO(tag.listCreatedAt) : null,
    topAlbums: tag.topAlbums
      ? map<WithId<AlbumRecord>, SerializableAlbum>(
          tag.topAlbums,
          serializeAlbum,
        )
      : undefined,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (serializedTag as any)._id;
  return serializedTag;
}
