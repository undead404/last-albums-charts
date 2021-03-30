import { WithId } from 'mongodb';

import { AlbumRecord, SerializableAlbum } from './types';

export default function serializeAlbum(
  album: WithId<AlbumRecord>,
): SerializableAlbum {
  const serializedAlbum = {
    ...album,
    duplicateOf: album.duplicateOf
      ? album.duplicateOf.toHexString()
      : undefined,
    id: album._id.toHexString(),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (serializedAlbum as any)._id;
  return serializedAlbum;
}
