import type { Album } from '../types';

export default function formatAlbum(album: Album, withDate = true): string {
  let title = `${album.artist} - ${album.name}`;
  if (withDate) {
    title = `${title} (${album.date})`;
  }
  return title;
}
