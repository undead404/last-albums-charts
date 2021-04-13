import fs from 'fs';
import path from 'path';

import mongoDatabase from '../common/mongo-database';

const TARGET_FILENAME = path.resolve('../site/src/tags.json');

export default async function saveTags(): Promise<void> {
  const tags = await mongoDatabase.tags
    .find(
      { listCreatedAt: { $ne: null }, topAlbums: { $ne: null } },
      { sort: [['power', -1]] },
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
