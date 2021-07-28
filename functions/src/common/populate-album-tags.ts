import SQL from '@nearform/sql';
import { isAfter, sub } from 'date-fns';
import reject from 'lodash/reject';
import toPairs from 'lodash/toPairs';

import { findAlbum } from './database/album';
import getAlbumTopTags from './lastfm/get-album-top-tags';
import database from './database';
import logger from './logger';
import normalizeTags from './normalize-tags';
import sequentialAsyncForEach from './sequential-async-for-each';
import { Album, AlbumTag } from './types';

export default async function populateAlbumTags(album: Album): Promise<void> {
  const albumRecord = await findAlbum({
    artist: album.artist,
    name: album.name,
  });
  if (!albumRecord) {
    logger.warn(
      `${album.artist} - ${album.name}: album already erased from db`,
    );
    return;
  }
  if (
    albumRecord.tagsUpdatedAt &&
    isAfter(albumRecord.tagsUpdatedAt, sub(new Date(), { months: 1 }))
  ) {
    return;
  }
  logger.debug(`populateAlbumTags: ${album.artist} - ${album.name}`);
  const tagsObjects = await getAlbumTopTags(album.name, album.artist);
  const tags = normalizeTags(tagsObjects);
  const oldTags = (
    await database.query<AlbumTag>(SQL`
      SELECT *
      FROM "AlbumTag"
      WHERE "albumArtist" = ${album.artist}
      AND "albumName" = ${album.name}
      ORDER BY "count" DESC
  `)
  ).rows;
  const tagsToRemove = reject(oldTags, (albumTag) => !!tags[albumTag.tagName]);
  try {
    await database.query('BEGIN');
    await sequentialAsyncForEach(tagsToRemove, async (albumTag) => {
      await database.query(SQL`
        DELETE FROM "AlbumTag"
        WHERE "albumArtist" = ${albumTag.albumArtist}
        AND "albumName" = ${albumTag.albumName}
        AND "tagName" = ${albumTag.tagName}
      `);
    });
    await sequentialAsyncForEach(toPairs(tags), async ([tagName, tagCount]) => {
      await database.query(SQL`
        INSERT INTO "Tag"("name")
        VALUES(${tagName})
        ON CONFLICT("name")
        DO NOTHING
      `);
      await database.query(SQL`
        INSERT INTO "AlbumTag"("albumArtist", "albumName", "count", "tagName")
        VALUES(${albumRecord.artist}, ${albumRecord.name}, ${tagCount}, ${tagName})
        ON CONFLICT("albumArtist", "albumName", "tagName")
        DO UPDATE SET "count" = EXCLUDED."count"
      `);
    });
    await database.query(SQL`
      UPDATE "Album"
      SET "tagsUpdatedAt" = NOW()
      WHERE "artist" = ${albumRecord.artist}
      AND "name" = ${albumRecord.name}
    `);
    await database.query('COMMIT');
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  }
}
