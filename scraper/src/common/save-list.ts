import SQL from '@nearform/sql';
import _ from 'lodash';

import database from './database/index.js';
import logger from './logger.js';
import sequentialAsyncForEach from './sequential-async-for-each.js';
import type { Album, Tag } from './types.js';

const { isEmpty } = _;

export default async function saveList(
  tag: Tag,
  albums?: Album[],
): Promise<void> {
  if (albums) {
    try {
      await database.query('BEGIN');
      await database.query(SQL`
        DELETE FROM "TagListItem"
        WHERE "tagName" = ${tag.name}
      `);
      await sequentialAsyncForEach(albums, async (album, index) => {
        const query = SQL`
          INSERT INTO "TagListItem"("albumArtist", "albumName", "place", "tagName")
          VALUES(${album.artist}, ${album.name}, ${index + 1}, ${tag.name})
          ON CONFLICT("place", "tagName")
          DO UPDATE SET "albumArtist" = EXCLUDED."albumArtist",
            "albumName" = EXCLUDED."albumName"
      `;

        // logger.debug(query.sql);
        await database.query(query);
      });
      const query = isEmpty(albums)
        ? SQL`
      UPDATE "Tag"
      SET "listCheckedAt" = NOW(),
        "listUpdatedAt" = NULL
      WHERE "name" = ${tag.name}
  `
        : SQL`
        UPDATE "Tag"
        SET "listCheckedAt" = NOW(),
          "listUpdatedAt" = NOW()
        WHERE "name" = ${tag.name}
    `;

      // logger.debug(query.sql);
      await database.query(query);
      await database.query('COMMIT');
    } catch (error) {
      await database.query('ROLLBACK');
      throw error;
    }
  } else {
    logger.debug(`${tag.name}: no changes`);
    await database.query(SQL`
        UPDATE "Tag"
        SET "listCheckedAt" = NOW()
        WHERE "name" = ${tag.name}
      `);
  }
}
