import SQL from '@nearform/sql';

import database from '../common/database';

export default async function saveModel(
  tagName: string,
  trainModel: unknown,
): Promise<void> {
  await database.query(SQL`
    UPDATE "Tag"
    SET "trainingModel" = ${trainModel}
    WHERE "name" = ${tagName}
  `);
}
