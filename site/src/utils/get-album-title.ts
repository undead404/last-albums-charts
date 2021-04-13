import { Album } from '../../types';

export default function getAlbumTitle(album: Album, withDate = true): string {
  let title = `${album.artist} - ${album.name}`;
  if (withDate) {
    title = `${title} (${album.date})`;
  }
  return title;
}
