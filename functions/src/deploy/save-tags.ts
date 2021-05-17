import fs from 'fs';
import path from 'path';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

const TARGET_FILENAME = path.resolve('../site/src/tags.json');
const TAGS_LIMIT = 1500;

export default async function saveTags(): Promise<void> {
  logger.debug('saveTags()');
  const tags = await mongoDatabase.tags
    .aggregate(
      [
        {
          $match: { listCreatedAt: { $ne: null }, topAlbums: { $ne: null } },
        },
        {
          $sort: {
            power: -1,
          },
        },
        {
          $limit: TAGS_LIMIT,
        },
        {
          $sort: {
            listUpdatedAt: -1,
            listCreatedAt: -1,
          },
        },
      ],
      { allowDiskUse: true },
    )
    .toArray();
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(TARGET_FILENAME, JSON.stringify({ tags }), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }),
  );
}
