import fs from 'fs';
import path from 'path';

import { WithId } from 'mongodb';

import { AlbumRecord } from '../common/types';

const TARGET_FILENAME = path.resolve('../site/src/top-list.json');

export default async function saveTopList(
  albums: WithId<AlbumRecord>[],
): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(TARGET_FILENAME, JSON.stringify({ albums }), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }),
  );
}
