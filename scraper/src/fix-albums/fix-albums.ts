import SQL from '@nearform/sql';

import database from '../common/database/index.js';
import formatError from '../common/format-error.js';
import logger from '../common/logger.js';
import populateAlbumStats from '../common/populate-album-stats.js';
import populateAlbumTags from '../common/populate-album-tags.js';
import Progress from '../common/progress.js';
import sequentialAsyncForEach from '../common/sequential-async-for-each.js';
import type { Album } from '../common/types.js';

const LIMIT_FOR_ONE_SHOT = 1000;

export default async function fixAlbums(): Promise<void> {
  logger.debug('fixAlbums()');
  const result = await database.query<Album>(SQL`
    SELECT "Album".*
    FROM "Album"
    LEFT JOIN "AlbumTag"
    ON "AlbumTag"."albumArtist" = "Album"."artist" AND
      "AlbumTag"."albumName" = "Album"."name"
    WHERE "Album"."hidden" = false AND
      (
        "Album"."listeners" IS NULL OR
        "AlbumTag"."albumName" IS NULL
      )
    GROUP BY "Album"."artist", "Album"."name"
    LIMIT ${LIMIT_FOR_ONE_SHOT}
  `);

  const albums = result.rows;
  logger.debug(`fixAlbums: ${albums.length} albums found to fix`);

  const progress = new Progress(
    albums.length,
    0,
    `fixAlbums for ${albums.length} albums`,
    logger,
  );

  await sequentialAsyncForEach(albums, async (album) => {
    try {
      await populateAlbumStats(album);
    } catch (error) {
      logger.error(`populateAlbumStats: ${formatError(error)}`);
    }
    try {
      await populateAlbumTags(album);
    } catch (error) {
      logger.error(`populateAlbumTags: ${formatError(error)}`);
    }
    progress.increment();
  });
}
