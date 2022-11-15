import SQL from '@nearform/sql';
import head from 'lodash/head';

import type { Tag, TagPayload, Weighted } from '../../types';
import logger from '../logger';

import database from './database';
import populateTagForPayload from './populate-tag-for-payload';

export default async function getTag(tagName: string): Promise<TagPayload> {
  logger.debug(`getTag(${tagName})`);
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
      WHERE "Tag"."name" = ${tagName}
      GROUP BY "Tag"."name"
      ORDER BY "weight" DESC
      LIMIT 1`)
  ).rows;

  logger.debug(`Found ${basicTags.length} basic tags`);
  const tag = head(basicTags);
  if (!tag) {
    throw new Error(`Tag ${tagName} not found`);
  }
  return populateTagForPayload(tag);
}
