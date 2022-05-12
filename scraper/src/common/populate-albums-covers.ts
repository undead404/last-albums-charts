import SQL from '@nearform/sql';
import isEmpty from 'lodash/isEmpty';

import checkUrl from './check-url';
import database from './database';
import getFromCoverArtArchive from './get-from-cover-art-archive';
import getFromDiscogs from './get-from-discogs';
import logger from './logger';
import Progress from './progress';
import sequentialAsyncMap from './sequential-async-map';
import { Album } from './types';

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
  logger.debug(`populateAlbumsCovers`);
  if (!albums || isEmpty(albums)) {
    return;
  }

  const progress = new Progress(
    albums.length,
    0,
    `populateAlbumsCovers for ${albums.length} albums`,
    logger,
  );

  // eslint-disable-next-line consistent-return
  return sequentialAsyncMap(albums, async (album) => {
    if (await check(album)) {
      progress.increment();
      return album;
    }

    let albumUpdate: null | Partial<Album> = null;

    if (album.mbid) {
      albumUpdate = await getFromCoverArtArchive(album.mbid);
    }
    if (!albumUpdate) {
      albumUpdate = await getFromDiscogs(
        album.artist,
        album.name,
        // eslint-disable-next-line no-magic-numbers
        album.date?.slice?.(0, 4),
      );
    }
    if (!albumUpdate) {
      progress.increment();
      return album;
    }

    const result = await database.query(SQL`
      UPDATE "Album"
      SET "cover" = ${albumUpdate.cover},
        "thumbnail" = ${albumUpdate.thumbnail}
      WHERE "artist" = ${album.artist} AND
        "name" = ${album.name}
      RETURNING *
    `);

    progress.increment();
    return result.rows[0];
  });
}
