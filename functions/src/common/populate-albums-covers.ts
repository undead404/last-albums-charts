import isEmpty from 'lodash/isEmpty';

import checkUrl from './check-url';
import getFromCoverArtArchive from './get-from-cover-art-archive';
import getFromDiscogs from './get-from-discogs';
import logger from './logger';
import sequentialAsyncMap from './sequential-async-map';
import { AlbumRecord } from './types';

async function check(album: AlbumRecord): Promise<boolean> {
  return !!(
    album.cover &&
    album.thumbnail &&
    (await checkUrl(album.cover)) &&
    (await checkUrl(album.thumbnail))
  );
}

export default async function populateAlbumsCovers(
  albums: AlbumRecord[] | null | undefined,
): Promise<AlbumRecord[] | undefined> {
  logger.info(`populateAlbumsCovers`);
  if (!albums || isEmpty(albums)) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return sequentialAsyncMap(albums, async (album) => {
    if (await check(album)) {
      return album;
    }
    let albumUpdate: null | Partial<AlbumRecord> = null;
    if (album.mbid) {
      albumUpdate = await getFromCoverArtArchive(album.mbid);
    }
    if (!albumUpdate) {
      albumUpdate = await getFromDiscogs(album.artist, album.name);
    }
    return {
      ...album,
      ...(albumUpdate || {}),
    };
  });
}
