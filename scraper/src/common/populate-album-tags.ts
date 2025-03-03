import SQL from '@nearform/sql';
import { isAfter, sub } from 'date-fns';
import _ from 'lodash';

import { findAlbum } from './database/album.js';
import database from './database/index.js';
import getAlbumTopTags from './lastfm/get-album-top-tags.js';
import logger from './logger.js';
import normalizeTags from './normalize-tags.js';
import sequentialAsyncForEach from './sequential-async-for-each.js';
import type { Album, AlbumTag } from './types.js';

const { reject, toPairs } = _;

export default async function populateAlbumTags(
  album: Album,
  isNew = false,
): Promise<void> {
  const albumRecord =
    (await findAlbum({
      artist: album.artist,
      name: album.name,
    })) || (isNew ? album : null);

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
  const oldTagsResult = await database.query<AlbumTag>(SQL`
    SELECT *
    FROM "AlbumTag"
    WHERE "albumArtist" = ${albumRecord.artist}
    AND "albumName" = ${albumRecord.name}
    ORDER BY "count" DESC
  `);
  const oldTags = oldTagsResult.rows;

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
