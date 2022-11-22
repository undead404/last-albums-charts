import SQL from '@nearform/sql';
import head from 'lodash/head';
import includes from 'lodash/includes';

import database from '../common/database';
import { deleteTag } from '../common/database/tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import removeTagDuplicates from '../common/remove-tag-duplicates';
import type { Tag } from '../common/types';

export default async function pickTag(): Promise<Pick<Tag, 'name'> | null> {
  const result = await database.query<Pick<Tag, 'name'>>(SQL`
    SELECT
      "Tag"."name"
    FROM "Tag"
    WHERE "albumsScrapedAt" IS NOT NULL AND
      "listCheckedAt" IS NOT NULL AND
      "listUpdatedAt" IS NOT NULL AND
      "trainingModel" IS NULL
    ORDER BY "albumsScrapedAt" ASC
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
