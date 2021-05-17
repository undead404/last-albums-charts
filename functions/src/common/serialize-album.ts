import { AlbumRecord, SerializableAlbum } from './types';

export default function serializeAlbum(album: AlbumRecord): SerializableAlbum {
  return {
    ...album,
    duplicateOf: album.duplicateOf
      ? album.duplicateOf.toHexString()
      : undefined,
    // id: album._id.toHexString(),
  };
}
