import SQL from '@nearform/sql';

import { AlbumInfo } from './lastfm/api-types';
import getAlbumInfo from './lastfm/get-album-info';
import database from './database';
import { Album } from './types';

export default async function maybeMisspelled(
  { artist, name }: Pick<Album, 'artist' | 'name'>,
  preparedAlbumInfo?: AlbumInfo,
): Promise<boolean> {
  const albumInfo = preparedAlbumInfo || (await getAlbumInfo(name, artist));

  if (!albumInfo) {
    return true;
  }
  if (albumInfo.artist === artist && albumInfo.name === name) {
    return false;
  }
  try {
    let isMisspelled = false;
    await database.query('BEGIN');
    const result = await database.query(SQL`
        UPDATE "Album"
        SET "hidden" = false
        WHERE "artist" = ${albumInfo.artist} AND
          "name" = ${albumInfo.name}
      `);

    if (result.rowCount > 0) {
      await database.query(SQL`
        UPDATE "Album"
        SET "hidden" = true
        WHERE "artist" = ${artist} AND
          "name" = ${name}
      `);
      isMisspelled = true;
    }
    await database.query('COMMIT');
    return isMisspelled;
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  }
}
