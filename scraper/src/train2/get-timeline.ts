import SQL from '@nearform/sql';
import find from 'lodash/find';
import map from 'lodash/map';

import database from '../common/database';
import logger from '../common/logger';

export interface TimelineItem {
  result: number;
  year: number;
}

export default async function getTimeline(
  tagName?: string,
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
  const timeline = queryResult.rows;
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
