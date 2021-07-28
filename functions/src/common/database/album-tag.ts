import SQL from '@nearform/sql';
import head from 'lodash/head';
import pick from 'lodash/pick';

import { Album, AlbumTag } from '../types';

import database from '.';

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
  const result = head(
    (await database.query<AlbumTag & Album, (AlbumTag & Album)[]>(query)).rows,
  );
  if (!result) {
    return null;
  }
  return {
    ...pick(result, ['albumArtist', 'albumName', 'count', 'tagName']),
    album: pick(result, [
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
