import SQL from '@nearform/sql';
import _ from 'lodash';

import type { Album } from '../types.js';

import database from './index.js';

const { head } = _;

// eslint-disable-next-line import/prefer-default-export
export async function findAlbum(
  where: Pick<Album, 'artist' | 'name'>,
): Promise<Album | null> {
  const query = SQL`
    SELECT *
    FROM "Album"
    WHERE "Album"."artist" = ${where.artist} AND
      "Album"."name" = ${where.name}
    LIMIT 1
  `;

  const result = await database.query<Album, Album[]>(query);

  return head(result.rows) || null;
}
