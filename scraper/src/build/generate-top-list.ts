import SQL from '@nearform/sql';
import _ from 'lodash'; const { reduce } = _;

import database from '../common/database/index.js';
import logger from '../common/logger.js';
import sequentialAsyncMap from '../common/sequential-async-map.js';
import type { Album, AlbumTag, TagListItem, Weighted } from '../common/types.js';

import saveTopList from './save-top-list.js';

const LIST_LENGTH = 100;

export default async function generateTopList(): Promise<void> {
  logger.debug('generateTopList()');
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

  const albums = await sequentialAsyncMap(result.rows, async (album) => ({
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

  await saveTopList(albums);
  logger.debug('generateTopList: success');
}
