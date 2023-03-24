import SQL from '@nearform/sql';
import _ from 'lodash';

import type { Album, TagListItem } from '../types.js';

import database from './index.js';

const { map, pick } = _;

// eslint-disable-next-line import/prefer-default-export
export async function getList(
  tagName: string,
): Promise<(TagListItem & { album: Album })[]> {
  const result = await database.query<TagListItem & Album>(SQL`
    SELECT *
    FROM "TagListItem"
    JOIN "Album"
    ON "Album"."artist" = "TagListItem"."albumArtist" AND
      "Album"."name" = "TagListItem"."albumName"
    WHERE "TagListItem"."tagName" = ${tagName}
    ORDER BY "TagListItem"."place" ASC
  `);

  return map(result.rows, (row) => ({
    ...pick(row, ['albumArtist', 'albumName', 'place', 'tagName', 'updatedAt']),
    album: pick(row, [
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
  }));
}
