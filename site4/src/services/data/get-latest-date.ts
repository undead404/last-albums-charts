import SQL from '@nearform/sql';

import logger from '../logger';

import database from './database';

export interface LatestDateResult {
  date: string;
}

export default async function getLatestDate(tagName?: string) {
  logger.debug(`getLatestDate(${tagName})`);
  const query = tagName
    ? SQL`
    SELECT "Album"."date" FROM "Album"
    INNER JOIN "AlbumTag"
    ON "Album"."artist" = "AlbumTag"."albumArtist"
    AND "Album"."name" = "AlbumTag"."albumName"
    WHERE "date" IS NOT NULL
    AND "Album"."hidden" <> TRUE
    AND "AlbumTag"."tagName" = ${tagName}
    ORDER BY "date" DESC
    LIMIT 1
  `
    : SQL`
    SELECT "Album"."date" FROM "Album"
    WHERE "date" IS NOT NULL
    ORDER BY "date" DESC
    LIMIT 1
  `;
  const result = await database.query<LatestDateResult>(query);
  return result.rows?.[0]?.date?.replaceAll?.('-00', '') || null;
}
