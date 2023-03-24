import _ from 'lodash';

import assure from '../assure.js';
import logger from '../logger.js';
import sequentialAsyncMap from '../sequential-async-map.js';

import acquire from './acquire.js';
import type { AlbumInfo, ArtistGetTopAlbumsPayload } from './api-types.js';
import getAlbumInfo from './get-album-info.js';

const { compact, isEmpty, reject, uniqBy } = _;

// const DEFAULT_PAGE_LIMIT = 200;
const DEFAULT_PAGE_LIMIT = 4;
const MAX_NAME_LENGTH = 1024;

export default async function getArtistTopAlbums(
  artistName: string,
): Promise<readonly AlbumInfo[]> {
  logger.debug(`artist.getTopAlbums(${artistName})`);
  assure('artist.getTopAlbums', { artistName });
  let currentPage = 1;
  let albums: AlbumInfo[] = [];

  while (currentPage <= DEFAULT_PAGE_LIMIT) {
    // eslint-disable-next-line no-await-in-loop
    const data = await acquire<ArtistGetTopAlbumsPayload>({
      artist: artistName,
      method: 'artist.getTopAlbums',
      page: currentPage,
    });

    const currentAlbums = reject(
      data?.topalbums?.album,
      (album) =>
        album.name === '(null)' ||
        album.name.length >= MAX_NAME_LENGTH ||
        album.artist.name.length >= MAX_NAME_LENGTH,
    );

    if (isEmpty(currentAlbums)) {
      break;
    }

    // eslint-disable-next-line no-await-in-loop
    const albumInfos = await sequentialAsyncMap(currentAlbums, (albumItem) =>
      getAlbumInfo(albumItem.name, albumItem.artist.name),
    );

    albums = [
      ...albums,
      ...uniqBy(
        compact(albumInfos),
        (albumInfo) => `${albumInfo.artist} - ${albumInfo.name}`,
      ),
    ];
    currentPage += 1;
  }

  return albums;
}
