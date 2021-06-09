import { Album } from '.prisma/client';
import isEmpty from 'lodash/isEmpty';

import checkUrl from './check-url';
import getFromCoverArtArchive from './get-from-cover-art-archive';
import getFromDiscogs from './get-from-discogs';
import logger from './logger';
import prisma from './prisma';
import sequentialAsyncMap from './sequential-async-map';

async function check(album: Album): Promise<boolean> {
  return !!(
    album.cover &&
    album.thumbnail &&
    (await checkUrl(album.cover)) &&
    (await checkUrl(album.thumbnail))
  );
}

export default async function populateAlbumsCovers(
  albums: Album[] | null | undefined,
): Promise<Album[] | undefined> {
  logger.info(`populateAlbumsCovers`);
  if (!albums || isEmpty(albums)) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return sequentialAsyncMap(albums, async (album) => {
    if (await check(album)) {
      return album;
    }
    let albumUpdate: null | Partial<Album> = null;
    if (album.mbid) {
      albumUpdate = await getFromCoverArtArchive(album.mbid);
    }
    if (!albumUpdate) {
      albumUpdate = await getFromDiscogs(album.artist, album.name);
    }
    if (!albumUpdate) {
      return album;
    }
    return prisma.album.update({
      data: albumUpdate,
      where: {
        artist_name: {
          artist: album.artist,
          name: album.name,
        },
      },
    });
  });
}
