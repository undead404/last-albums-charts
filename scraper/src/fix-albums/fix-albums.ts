import SQL from '@nearform/sql';
import toString from 'lodash/toString';

import database from '../common/database';
import logger from '../common/logger';
import populateAlbumStats from '../common/populate-album-stats';
import populateAlbumTags from '../common/populate-album-tags';
import Progress from '../common/progress';
import sequentialAsyncForEach from '../common/sequential-async-for-each';
import { Album } from '../common/types';

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
      logger.error(toString(error));
    }
    try {
      await populateAlbumTags(album);
    } catch (error) {
      logger.error(toString(error));
    }
    progress.increment();
  });
}
