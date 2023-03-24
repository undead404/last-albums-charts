import SQL from '@nearform/sql';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import take from 'lodash/take';

import logger from '../logger';

import database from './database';

const DEFAULT_NUMBER_OF_RELATED_TAGS = 5;
const MIN_WEIGHT_MULTIPLIER = 0.1;

export default async function getRelatedTags(
  tagName: string,
): Promise<string[]> {
  logger.debug(`getRelatedTags(${tagName})`);
  const relatedTags = (
    await database.query<{ tagName: string; weight: number }>(SQL`
        SELECT "second_tag"."tagName" AS "tagName",
            AVG(LEAST("first_tag"."count", "second_tag"."count")) * COUNT(*) AS "weight"
        FROM "Album"
        INNER JOIN "AlbumTag"
        AS "first_tag"
        ON "Album"."artist" = "first_tag"."albumArtist"
        AND "Album"."name" = "first_tag"."albumName"
        LEFT JOIN "AlbumTag"
        AS "second_tag"
        ON "second_tag"."albumArtist" = "Album"."artist"
        AND "second_tag"."albumName" = "Album"."name"
        LEFT JOIN "Tag"
        AS "second_tag_tag"
        ON "second_tag_tag"."name" = "second_tag"."tagName"
        WHERE "first_tag"."tagName" = ${tagName}
        AND "second_tag_tag"."listUpdatedAt" IS NOT NULL
        GROUP BY "second_tag"."tagName"
        ORDER BY "weight" DESC
    `)
  ).rows;
  logger.debug(`Found ${relatedTags.length} related tags`);
  const tagItself = find(relatedTags, ['tagName', tagName]);
  if (!tagItself) {
    return map(take(relatedTags, DEFAULT_NUMBER_OF_RELATED_TAGS), 'tagName');
  }
  const weightLimit = tagItself.weight * MIN_WEIGHT_MULTIPLIER;
  return map(
    filter(
      relatedTags,
      (relatedTag) =>
        relatedTag.tagName !== tagName && relatedTag.weight >= weightLimit,
    ),
    'tagName',
  );
}
