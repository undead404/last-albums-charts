import SQL from '@nearform/sql';
import _ from 'lodash';

import type { Tag, TagListItem } from '../types.js';

import database from './index.js';

const { find, forEach, pick } = _;

export async function deleteTag({ name }: { name: string }): Promise<void> {
  await database.query(SQL`
    DELETE FROM "Tag"
    WHERE "Tag"."name" = ${name}
  `);
}

// export async function findTagWithList({
//   name,
// }: {
//   name: string;
// }): Promise<(Tag & { list: TagListItem[] }) | null> {
//   const result = await database.query<Tag & TagListItem>(SQL`
//     SELECT "Tag".*
//     FROM "Tag"
//     INNER JOIN "TagListItem"
//     ON "TagListItem"."tagName" = "Tag"."name"
//     WHERE "Tag"."name" = ${name}
//     ORDER BY "TagListItem"."place" ASC
//   `);
//   const firstRow = head(result.rows);
//   if (!firstRow) {
//     return null;
//   }
//   return {
//     ...pick(firstRow, [
//       'albumsScrapedAt',
//       'listCheckedAt',
//       'listUpdatedAt',
//       'name',
//       'registeredAt',
//     ]),
//     list: map(result.rows, (row) =>
//       pick(row, ['albumArtist', 'albumName', 'place', 'tagName', 'updatedAt']),
//     ),
//   };
// }

export async function findTagsWithLists(): Promise<
  (Tag & { list: TagListItem[] })[]
> {
  const result = await database.query<Tag & TagListItem>(SQL`
    SELECT
      "Tag"."albumsScrapedAt",
      "Tag"."listCheckedAt",
      "Tag"."listUpdatedAt",
      "Tag"."name",
      "Tag"."registeredAt",
      "TagListItem".*
    FROM "Tag"
    INNER JOIN "TagListItem"
    ON "TagListItem"."tagName" = "Tag"."name"
    ORDER BY "Tag"."listUpdatedAt" DESC,
      "Tag"."listCheckedAt" DESC,
      "TagListItem"."place" ASC
  `);

  let currentTag: (Tag & { list: TagListItem[] }) | null = null;
  const tags: (Tag & { list: TagListItem[] })[] = [];
  forEach(result.rows, (row) => {
    if (!currentTag || currentTag.name !== row.name) {
      currentTag = find(tags, ['name', row.name]) || null;
    }
    if (!currentTag) {
      currentTag = {
        ...pick(row, [
          'albumsScrapedAt',
          'listCheckedAt',
          'listUpdatedAt',
          'name',
          'registeredAt',
        ]),
        list: [],
      };
      tags.push(currentTag);
    }
    currentTag.list.push(
      pick(row, ['albumArtist', 'albumName', 'place', 'tagName', 'updatedAt']),
    );
  });
  return tags;
}
