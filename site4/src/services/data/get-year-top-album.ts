import SQL from '@nearform/sql';
import head from 'lodash/head';

import type { Album } from '../../types';
import logger from '../logger';

import database from './database';

export default async function getYearTopAlbum(
  year: number,
  tagName?: string,
): Promise<
  Pick<Album, 'artist' | 'name' | 'date' | 'numberOfTracks'> | undefined
> {
  logger.debug(`getYearTopAlbum(${year}, ${tagName})`);
  const query = tagName
    ? SQL`
    SELECT "Album"."artist", "Album"."name", "Album"."date", "Album"."numberOfTracks"
    FROM "Album"
    INNER JOIN "AlbumTag"
    ON "AlbumTag"."albumArtist" = "Album"."artist"
    AND "AlbumTag"."albumName" = "Album"."name"
    WHERE "Album"."date" LIKE ${`${year}%`}
    AND "Album"."hidden" <> TRUE
    AND "AlbumTag"."tagName" = ${tagName}
    ORDER BY
      "AlbumTag"."count"::FLOAT / 1000 * "Album"."playcount"::FLOAT / 100 * "AlbumTag"."count" DESC
    LIMIT 1
  `
    : SQL`
    SELECT "Album"."artist", "Album"."name", "Album"."date", "Album"."numberOfTracks"
    FROM "Album"
    INNER JOIN "AlbumTag"
    ON "AlbumTag"."albumArtist" = "Album"."artist"
    AND "AlbumTag"."albumName" = "Album"."name"
    WHERE "Album"."date" LIKE ${`${year}%`}
    AND "Album"."hidden" <> TRUE
    ORDER BY
      "AlbumTag"."count"::FLOAT / 1000 * "Album"."playcount"::FLOAT / 100 * "AlbumTag"."count" DESC
    LIMIT 1
  `;
  const result = await database.query<
    Pick<Album, 'artist' | 'name' | 'date' | 'numberOfTracks'>
  >(query);
  return head(result.rows);
}
