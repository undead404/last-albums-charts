import fs from 'fs';
import path from 'path';

import SQL from '@nearform/sql';
import head from 'lodash/head';

import { TAGS_LIMIT } from '../common/constants';
import database from '../common/database';
import logger from '../common/logger';
import Progress from '../common/progress';
import sequentialAsyncMap from '../common/sequential-async-map';
import { Album, AlbumTag, Tag, TagListItem, Weighted } from '../common/types';

export default async function saveTags(tagsLimit?: number): Promise<void> {
  logger.debug('saveTags()');
  const targetFilename = path.resolve(
    tagsLimit ? `../site/src/tags_${tagsLimit}.json` : '../site/src/tags.json',
  );

  const basicTags = (
    await database.query<Weighted<Tag>>(SQL`
      SELECT "Tag".*,
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
    `saveTags - ${basicTags.length} tags`,
    logger,
  );

  const tags = await sequentialAsyncMap(basicTags, async (tag) => {
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
            places: (
              await database.query<TagListItem>(SQL`
                SELECT *
                FROM "TagListItem"
                WHERE "albumArtist" = ${tagListItem.albumArtist} AND
                  "albumName" = ${tagListItem.albumName}
                ORDER BY "place" ASC
            `)
            ).rows,
            tags: (
              await database.query<AlbumTag>(SQL`
              SELECT *
              FROM "AlbumTag"
              WHERE "albumArtist" = ${tagListItem.albumArtist} AND
                "albumName" = ${tagListItem.albumName}
              ORDER BY "count" DESC
            `)
            ).rows,
          },
        }),
      ),
    };

    progress.increment();
    return populatedTag;
  });

  return new Promise<void>((resolve, reject) =>
    fs.writeFile(
      targetFilename,
      JSON.stringify(
        { tags },
        // eslint-disable-next-line lodash/prefer-lodash-typecheck
        (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
      ),
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    ),
  );
}
