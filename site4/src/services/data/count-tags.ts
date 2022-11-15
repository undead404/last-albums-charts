import SQL from '@nearform/sql';
import isNil from 'lodash/isNil';

import database from './database';

export default async function countTags(tagsLimit = 100_000): Promise<number> {
  const resultRows = (
    await database.query<{ numberOfTags: number }>(SQL`
      SELECT COUNT("Tag"."name")
      AS "numberOfTags"
      FROM "Tag"
      WHERE "Tag"."listUpdatedAt" IS NOT NULL
      LIMIT ${tagsLimit}`)
  ).rows;
  const numberOfTags = resultRows[0]?.numberOfTags;
  if (isNil(numberOfTags)) {
    throw new Error('Failed to count tags');
  }
  return numberOfTags;
}
