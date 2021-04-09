import { Album } from 'types';

export default function getAlbumTitle(album: Album): string {
  return `${album.artist} - ${album.name} (${album.date})`;
}
