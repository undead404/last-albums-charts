import fs from 'fs';
import path from 'path';

import logger from '../common/logger';
import { Album } from '../common/types';

const TARGET_FILENAME = path.resolve('../site/src/top-list.json');

export default async function saveTopList(albums: Album[]): Promise<void> {
  logger.debug('saveTopList()');
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
