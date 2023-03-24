import SQL from '@nearform/sql';
import _ from 'lodash';

import database from '../common/database/index.js';
import { deleteTag } from '../common/database/tag.js';
import isTagBlacklisted from '../common/is-tag-blacklisted.js';
import logger from '../common/logger.js';
import removeTagDuplicates from '../common/remove-tag-duplicates.js';
import type { Tag, Weighted } from '../common/types.js';

const { head, includes } = _;

export default async function pickTag(): Promise<Tag | null> {
  const result = await database.query<Weighted<Tag>>(SQL`
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
    ON "Album"."artist" = "AlbumTag"."albumArtist" AND
      "Album"."name" = "AlbumTag"."albumName"
    WHERE "albumsScrapedAt" IS NOT NULL AND
      "listCheckedAt" IS NULL AND
      "listUpdatedAt" IS NULL AND
      "Album"."hidden" <> true
    GROUP BY "Tag"."name"
    ORDER BY "weight" DESC
    LIMIT 1
  `);

  const tag = head(result.rows);

  if (tag) {
    if (isTagBlacklisted(tag.name)) {
      logger.warn(`${tag.name} - blacklisted...`);
      await deleteTag({ name: tag.name });
      return pickTag();
    }

    const removedDuplicates = await removeTagDuplicates(tag.name);

    if (includes(removedDuplicates, tag.name)) {
      logger.warn(`${tag.name} - removed as a duplicate`);
      return pickTag();
    }
    logger.debug(`Picked tag: ${tag.name}`);
  } else {
    logger.warn('No tags picked');
  }

  return tag || null;
}
