import SQL from '@nearform/sql';
import includes from 'lodash/includes';

import database from '../common/database';
import { deleteTag } from '../common/database/tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import removeTagDuplicates from '../common/remove-tag-duplicates';
import { Tag } from '../common/types';

export default async function pickTag(): Promise<Tag | null> {
  const result = await database.query<Tag>(SQL`
    SELECT *
    FROM "Tag"
    WHERE "albumsScrapedAt" IS NOT NULL AND
      "listCheckedAt" IS NOT NULL
    ORDER BY "listCheckedAt" ASC
    LIMIT 1
  `);
  if (result.rowCount === 0) {
    logger.warn('No tags picked');
    return null;
  }
  const tag = result.rows[0];
  if (isTagBlacklisted(tag.name)) {
    logger.warn(`${tag.name} - blacklisted...`);
    await deleteTag(tag);
    return pickTag();
  }
  const removedDuplicates = await removeTagDuplicates(tag.name);
  if (includes(removedDuplicates, tag.name)) {
    logger.warn(`${tag.name} - removed as a duplicate`);
    return pickTag();
  }
  logger.debug(`Picked tag: ${tag.name}`);
  return tag;
}
