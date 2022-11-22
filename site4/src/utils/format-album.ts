import type { Album } from '../types';

export default function formatAlbum(
  album: Pick<Album, 'artist' | 'name' | 'date'>,
  withDate = true,
): string {
  let title = `${album.artist} - ${album.name}`;
  if (withDate) {
    title = `${title} (${album.date})`;
  }
  return title;
}
