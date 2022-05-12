import type { Album } from '../types';

import getAlbumTitle from './get-album-title';

export default function getAlbumKey(album: Album): string {
  return getAlbumTitle(album, false);
}
