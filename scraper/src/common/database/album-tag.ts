import SQL from '@nearform/sql';
import _ from 'lodash';

import type { Album, AlbumTag } from '../types.js';

import database from './index.js';

const { head, pick } = _;

// eslint-disable-next-line import/prefer-default-export
export async function findAlbumTagWithAlbum(
  where: Pick<AlbumTag, 'albumArtist' | 'albumName' | 'tagName'>,
): Promise<(AlbumTag & { album: Album }) | null> {
  const query = SQL`
    SELECT *
    FROM "AlbumTag"
    JOIN "Album"
    ON "Album"."artist" = "AlbumTag"."albumArtist" AND
      "Album"."name" = "AlbumTag"."albumName"
    WHERE "AlbumTag"."albumArtist" = ${where.albumArtist} AND
      "AlbumTag"."albumName" = ${where.albumName} AND
      "AlbumTag"."tagName" = ${where.tagName}
    LIMIT 1
  `;
  const result = await database.query<AlbumTag & Album, (AlbumTag & Album)[]>(
    query,
  );
  const resultRow = head(result.rows);

  if (!resultRow) {
    return null;
  }

  return {
    ...pick(resultRow, ['albumArtist', 'albumName', 'count', 'tagName']),
    album: pick(resultRow, [
      'artist',
      'cover',
      'date',
      'duration',
      'hidden',
      'listeners',
      'mbid',
      'name',
      'numberOfTracks',
      'playcount',
      'registeredAt',
      'thumbnail',
    ]),
  };
}
