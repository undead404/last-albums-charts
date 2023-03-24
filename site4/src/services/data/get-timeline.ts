import SQL from '@nearform/sql';
import find from 'lodash/find';
import map from 'lodash/map';

import type { Album } from '../../types';
import sequentialAsyncMap from '../../utils/sequential-async-map';
import logger from '../logger';

import database from './database';
import getYearTopAlbum from './get-year-top-album';

export interface TimelineItem {
  topAlbum?:
    | Pick<Album, 'artist' | 'name' | 'date' | 'numberOfTracks'>
    | undefined;
  result: number;
  year: number;
}

export default async function getTimeline(
  tagName?: string,
  includeTopAlbum = true,
): Promise<TimelineItem[]> {
  logger.debug(`getTimeline(${tagName})`);
  const query = tagName
    ? SQL`
    SELECT
      SUBSTRING("Album"."date" FROM 1 FOR 4)::INT AS "year",
      SUM("Album"."playcount"::FLOAT / 1000)::FLOAT AS "result" FROM "Tag"
    INNER JOIN "AlbumTag"
    ON "AlbumTag"."tagName" = "Tag"."name"
    INNER JOIN "Album"
    ON "AlbumTag"."albumArtist" = "Album"."artist"
    AND "AlbumTag"."albumName" = "Album"."name"
    AND "Album"."hidden" <> true
    AND "date" IS NOT NULL
    WHERE "Tag"."name" = ${tagName}
    GROUP BY "year"
    ORDER BY "year" ASC
  `
    : SQL`
    SELECT
      SUBSTRING("Album"."date" FROM 1 FOR 4)::INT AS "year",
      SUM("Album"."playcount"::FLOAT / 1000)::FLOAT AS "result" FROM "Tag"
    INNER JOIN "AlbumTag"
    ON "AlbumTag"."tagName" = "Tag"."name"
    INNER JOIN "Album"
    ON "AlbumTag"."albumArtist" = "Album"."artist"
    AND "AlbumTag"."albumName" = "Album"."name"
    AND "Album"."hidden" <> true
    AND "date" IS NOT NULL
    GROUP BY "year"
    ORDER BY "year" ASC
  `;
  const queryResult = await database.query<TimelineItem>(query);
  const timeline = includeTopAlbum
    ? await sequentialAsyncMap(queryResult.rows, async (timelineItem) => ({
        ...timelineItem,
        topAlbum: await getYearTopAlbum(timelineItem.year, tagName),
      }))
    : queryResult.rows;
  // correctedTimeline.push({
  //   result: predictNext(map(timeline, ({ result, year }) => [year, result])),
  //   year: yearNow + 1,
  // });
  const yearNow = new Date().getFullYear();

  const startingYear = Math.min(...map(timeline, 'year'));
  const endingYear = Math.max(...map(timeline, 'year'), yearNow);
  const correctedTimeline = [];
  for (
    let currentYear = startingYear;
    currentYear <= endingYear;
    currentYear += 1
  ) {
    correctedTimeline.push({
      result: 0,
      year: currentYear,
      ...find(timeline, ['year', currentYear]),
    });
  }
  return correctedTimeline;
}
