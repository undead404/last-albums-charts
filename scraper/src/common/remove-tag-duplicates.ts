import SQL from '@nearform/sql';
import map from 'lodash/map';
import replace from 'lodash/replace';

import database from './database';
import logger from './logger';
import sequentialAsyncForEach from './sequential-async-for-each';

export default async function removeTagDuplicates(
  tagName: string,
): Promise<string[]> {
  logger.debug(`removeTagDuplicates(${tagName})`);
  const query = SQL`
    SELECT "weighted_tags"."name" AS "name"
    FROM (
      SELECT "Tag".*,
        SUM(
          "AlbumTag"."count" :: FLOAT * COALESCE("Album"."playcount", 0) / 1000000 * COALESCE("Album"."listeners", 0) / 1000
        ) AS "weight"
      FROM "Tag"
      JOIN "AlbumTag" ON "AlbumTag"."tagName" = "Tag"."name"
      JOIN "Album" ON "Album"."artist" = "AlbumTag"."albumArtist"
      AND "Album"."name" = "AlbumTag"."albumName"
      WHERE
        REGEXP_REPLACE("Tag"."name", '\\W+', '', 'g') = ${replace(
          tagName,
          /[^\da-z]/gi,
          '',
        )}
      GROUP BY "Tag"."name"
      ORDER BY "weight" DESC
    ) AS "weighted_tags" OFFSET 1
  `;

  // logger.debug(query);
  const result = await database.query<{ name: string }>(query);
  // eslint-disable-next-line no-console
  console.debug(tagName, result.rows);
  await sequentialAsyncForEach(result.rows, async ({ name }) => {
    await database.query(SQL`
      DELETE FROM "Tag"
      WHERE "name" = ${name}
    `);
  });
  return map(result.rows, 'name');
}
