import SQL from '@nearform/sql';
import head from 'lodash/head';
import reduce from 'lodash/reduce';

import { TAGS_LIMIT } from '../common/constants';
import database from '../common/database';
import logger from '../common/logger';
import Progress from '../common/progress';
import sequentialAsyncMap from '../common/sequential-async-map';
import type {
  Album,
  AlbumTag,
  Tag,
  TagListItem,
  TagPayload,
  Weighted,
} from '../common/types';

export default async function getTags(
  tagsLimit?: number,
): Promise<TagPayload[]> {
  const basicTags = (
    await database.query<Weighted<Tag>>(SQL`
      SELECT
        "Tag"."albumsScrapedAt",
        "Tag"."listCheckedAt",
        "Tag"."listUpdatedAt",
        "Tag"."name",
        "Tag"."registeredAt",
        SUM("AlbumTag"."count"::FLOAT * COALESCE("Album"."playcount", 0) / 1000000 * COALESCE("Album"."listeners", 0) / 1000)
        AS "weight"
      FROM "Tag"
      JOIN "AlbumTag"
      ON "AlbumTag"."tagName" = "Tag"."name"
      JOIN "Album"
      ON "Album"."artist" = "AlbumTag"."albumArtist"
      AND "Album"."name" = "AlbumTag"."albumName"
      AND "Album"."hidden" <> true
      WHERE "Tag"."listUpdatedAt" IS NOT NULL
      GROUP BY "Tag"."name"
      ORDER BY "weight" DESC
      LIMIT ${tagsLimit || TAGS_LIMIT}`)
  ).rows;

  const progress = new Progress(
    basicTags.length,
    0,
    `getTags - ${basicTags.length} tags`,
    logger,
  );

  return sequentialAsyncMap(basicTags, async (tag) => {
    const populatedTag = {
      ...tag,
      list: await sequentialAsyncMap(
        (
          await database.query<TagListItem>(SQL`
            SELECT *
            FROM "TagListItem"
            WHERE "tagName" = ${tag.name}
            ORDER BY "place" ASC`)
        ).rows,
        async (tagListItem) => ({
          ...tagListItem,
          album: {
            ...head(
              (
                await database.query<Album>(SQL`
                  SELECT *
                  FROM "Album"
                  WHERE "artist" = ${tagListItem.albumArtist}
                  AND "name" = ${tagListItem.albumName}
                  LIMIT 1`)
              ).rows,
            ),
            places: reduce(
              (
                await database.query<TagListItem>(SQL`
                SELECT *
                FROM "TagListItem"
                WHERE "albumArtist" = ${tagListItem.albumArtist} AND
                  "albumName" = ${tagListItem.albumName}
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
              WHERE "albumArtist" = ${tagListItem.albumArtist} AND
                "albumName" = ${tagListItem.albumName}
              ORDER BY "count" DESC
            `)
              ).rows,
              (tagsMap, tagItem) => ({
                ...tagsMap,
                [tagItem.tagName]: tagItem.count,
              }),
              {},
            ),
          },
        }),
      ),
    };

    progress.increment();
    return populatedTag;
  }) as Promise<TagPayload[]>;
}
