import SQL from '@nearform/sql';
import { parseISO } from 'date-fns';

import database, { initDatabase } from './database.mjs';

export default async function getTagLastmod(tagName) {
  await initDatabase();
  const result = await database.query(SQL`
    SELECT "listUpdatedAt"
    FROM "Tag"
    WHERE "name" = ${tagName}
  `);
  if (!result?.at?.(0)?.listUpdatedAt) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return parseISO(result[0].listUpdatedAt);
}
