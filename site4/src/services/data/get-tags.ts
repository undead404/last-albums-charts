import SQL from '@nearform/sql';

import type { Tag, TagPayload, Weighted } from '../../types';
import sequentialAsyncMap from '../../utils/sequential-async-map';
import logger from '../logger';

import database from './database';
import populateTagForPayload from './populate-tag-for-payload';

export default async function getTags(
  tagsLimit = 100_000,
): Promise<TagPayload[]> {
  logger.debug(`getTags(${tagsLimit})`);
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
      LIMIT ${tagsLimit}`)
  ).rows;

  logger.debug(`Found ${basicTags.length} basic tags`);

  return sequentialAsyncMap<Weighted<Tag>, TagPayload>(
    basicTags,
    populateTagForPayload,
  );
}
