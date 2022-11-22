import SQL from '@nearform/sql';
import find from 'lodash/find';
import map from 'lodash/map';

import type { Album } from '../../types';
import predictNext from '../../utils/predict';
import sequentialAsyncMap from '../../utils/sequential-async-map';
import logger from '../logger';

import database from './database';
import getTrainModel from './get-train-model';
import getYearTopAlbum from './get-year-top-album';

export interface TimelineItem {
  topAlbum?:
    | Pick<Album, 'artist' | 'name' | 'date' | 'numberOfTracks'>
    | undefined;
  result: number;
  year: number;
}

const PREDICTION_YEARS = 10;

export default async function getTimeline(
  tagName?: string,
  includeTopAlbum = true,
  includePrediction = false,
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
  const currentTopAlbum = timeline.at(-1)?.topAlbum;
  if (includePrediction && tagName) {
    const trainModel = await getTrainModel(tagName);
    if (trainModel) {
      timeline.length -= 1;
      const predictions = await predictNext(
        trainModel,
        map(timeline, 'result'),
        PREDICTION_YEARS,
      );
      timeline.push(
        ...map(predictions, (predictedValue, index) => ({
          result: predictedValue,
          topAlbum: index === 0 ? currentTopAlbum : undefined,
          year: yearNow + index,
        })),
      );
    }
  }

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
