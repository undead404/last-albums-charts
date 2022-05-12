import SQL from '@nearform/sql';
import head from 'lodash/head';
import includes from 'lodash/includes';

import database from '../common/database';
import { deleteTag } from '../common/database/tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import removeTagDuplicates from '../common/remove-tag-duplicates';
import { Tag, Weighted } from '../common/types';

export default async function pickTag(): Promise<Tag | null> {
  const result = await database.query<Weighted<Tag>>(SQL`
    SELECT "Tag".*,
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

  if (!tag) {
    logger.warn('No tags picked');
  } else {
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
  }

  return tag || null;
}
