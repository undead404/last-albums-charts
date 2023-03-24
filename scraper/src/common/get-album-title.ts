import type { Album } from './types.js';

export default function getAlbumTitle(album: Album): string {
  return `${album.artist} - ${album.name} (${album.date})`;
}
