import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { AlbumRecord, Rated, Weighted } from './types';

export default function rateAlbums<T extends Weighted<AlbumRecord>>(
  albums: T[],
): Rated<T>[] {
  const albumsByWeight = sortBy(albums, (album) => -album.weight);
  return map(albums, (album) => ({
    ...album,
    rating:
      findIndex(
        albumsByWeight,
        // { name: album.name },
        // eslint-disable-next-line lodash/matches-shorthand
        (albumItem) =>
          albumItem.artist === album.artist && albumItem.name === album.name,
      ) + 1,
  }));
}
