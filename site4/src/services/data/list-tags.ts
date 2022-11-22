import SQL from '@nearform/sql';
import map from 'lodash/map';

import logger from '../logger';

import database from './database';

export default async function listTags(tagsLimit = 100_000): Promise<string[]> {
  logger.debug(`listTags(${tagsLimit})`);
  const tags = (
    await database.query<{ name: string }>(SQL`
      SELECT "Tag"."name"
      FROM "Tag"
      WHERE "Tag"."listUpdatedAt" IS NOT NULL
      LIMIT ${tagsLimit}`)
  ).rows;

  logger.debug(`Found ${tags.length} tag names`);

  return map(tags, 'name');
}
