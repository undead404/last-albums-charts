import SQL from '@nearform/sql';
import _ from 'lodash';

import database from '../common/database/index.js';
import type { Tag } from '../common/types.js';

const { head } = _;

export default async function pickTag(): Promise<Tag | undefined> {
  let result = await database.query<Tag>(SQL`
    SELECT
      "Tag"."albumsScrapedAt",
      "Tag"."listCheckedAt",
      "Tag"."listUpdatedAt",
      "Tag"."name",
      "Tag"."registeredAt",
      SUM("AlbumTag"."count"::FLOAT * COALESCE("Album"."playcount", 0) / 1000000 * COALESCE("Album"."listeners", 0) / 1000)
      AS "weight"
    FROM "Tag"
    JOIN "AlbumTag"
    ON "AlbumTag"."tagName" = "Tag"."name"
    JOIN "Album"
    ON "Album"."artist" = "AlbumTag"."albumArtist"
    AND "Album"."name" = "AlbumTag"."albumName"
    AND "Album"."hidden" <> true
    WHERE "albumsScrapedAt" IS NULL
    GROUP BY "Tag"."name"
    ORDER BY "weight" DESC
    LIMIT 1
  `);

  if (result.rowCount > 0) {
    return result.rows[0];
  }
  result = await database.query<Tag>(SQL`
    SELECT
      "Tag"."albumsScrapedAt",
      "Tag"."listCheckedAt",
      "Tag"."listUpdatedAt",
      "Tag"."name",
      "Tag"."registeredAt"
    FROM "Tag"
    ORDER BY "albumsScrapedAt" ASC
    LIMIT 1
  `);
  return head(result.rows);
}
