import SQL from '@nearform/sql';
import reduce from 'lodash/reduce';

import type { Album, AlbumTag, TagListItem, Weighted } from '../../types';
import sequentialAsyncMap from '../../utils/sequential-async-map';
import logger from '../logger';

import database from './database';

const LIST_LENGTH = 100;

export default async function getTopList() {
  logger.debug('getTopList');
  const result = await database.query<Weighted<Album> & { rating: string }>(SQL`
    SELECT "bydate".*,
      ROW_NUMBER() OVER (ORDER BY "bydate"."weight" DESC) AS "rating"
    FROM (
      SELECT *,
        (COALESCE("playcount", 0)::FLOAT / COALESCE("numberOfTracks", (
          SELECT AVG("numberOfTracks") FROM "Album" WHERE "numberOfTracks" IS NOT NULL
        ))) *
          COALESCE("listeners", 0) / COALESCE("numberOfTracks", (
            SELECT AVG("numberOfTracks") FROM "Album" WHERE "numberOfTracks" IS NOT NULL
          ))
        AS "weight"
      FROM "Album"
      WHERE "date" IS NOT NULL AND
        "hidden" = false
      ORDER BY "weight" DESC
      LIMIT ${LIST_LENGTH}
    ) AS "bydate"
    ORDER BY "bydate"."date" ASC
  `);
  logger.debug(result);

  return sequentialAsyncMap(result.rows, async (album) => ({
    ...album,
    rating: Number.parseInt(album.rating, 10),
    places: reduce(
      (
        await database.query<TagListItem>(SQL`
        SELECT *
        FROM "TagListItem"
        WHERE "albumArtist" = ${album.artist} AND
          "albumName" = ${album.name}
        ORDER BY "place" ASC
      `)
      ).rows,
      (placesMap, place) => ({
        ...placesMap,
        [place.tagName]: place.place,
      }),
      {},
    ),
    tags: reduce(
      (
        await database.query<AlbumTag>(SQL`
        SELECT *
        FROM "AlbumTag"
        WHERE "albumArtist" = ${album.artist} AND
          "albumName" = ${album.name}
        ORDER BY "count" DESC
      `)
      ).rows,
      (tagsMap, tag) => ({
        ...tagsMap,
        [tag.tagName]: tag.count,
      }),
      {},
    ),
  }));
}
