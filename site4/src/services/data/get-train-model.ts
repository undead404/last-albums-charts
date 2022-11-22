import SQL from '@nearform/sql';
import get from 'lodash/get';

import database from './database';

export default async function getTrainModel(tagName: string): Promise<unknown> {
  const result = await database.query(SQL`
    SELECT "trainingModel"
    FROM "Tag"
    WHERE "name" = ${tagName}
  `);
  const trainModel = get(result, 'rows[0].trainingModel');
  console.info(typeof trainModel);
  console.info(trainModel);
  return trainModel;
}
