import _ from 'lodash';

import assure from '../assure.js';
import logger from '../logger.js';

import acquire from './acquire.js';
import type { TagGetTopAlbumsPayload } from './api-types.js';

const { isEmpty, map, reject } = _;

const MAX_PAGE_AVAILABLE = 200;
const MAX_NAME_LENGTH = 1024;

export default async function getTagTopAlbums(
  tagName: string,
): Promise<readonly { artist: string; mbid?: string; name: string }[]> {
  logger.debug(`tag.getTopAlbums(${tagName})`);
  assure('tag.getTopAlbums', { tagName });
  let currentPage = 1;
  let albums = [] as readonly { artist: string; mbid?: string; name: string }[];

  while (currentPage <= MAX_PAGE_AVAILABLE) {
    // eslint-disable-next-line no-await-in-loop
    const data = await acquire<TagGetTopAlbumsPayload>({
      method: 'tag.getTopAlbums',
      page: currentPage,
      tag: tagName,
    });

    const currentAlbums = map(
      reject(
        data?.albums?.album,
        (album) =>
          album.name === '(null)' ||
          album.name.length >= MAX_NAME_LENGTH ||
          album.artist.name.length >= MAX_NAME_LENGTH,
      ),
      (album) => ({
        artist: album.artist.name,
        mbid: album.mbid,
        name: album.name,
      }),
    );

    if (isEmpty(currentAlbums)) {
      break;
    }
    // eslint-disable-next-line no-await-in-loop
    // const albumInfos = await sequentialAsyncMap(currentAlbums, (albumItem) =>
    //   getAlbumInfo(albumItem.name, albumItem.artist.name),
    // );
    // albums = [...albums, ...compact(uniqBy(albums, 'name'))];
    albums = [...albums, ...currentAlbums];
    currentPage += 1;
  }

  return albums;
}
