import fs from 'fs';
import path from 'path';

import { Album, AlbumTag, TagListItem } from '.prisma/client';

import logger from '../common/logger';

const TARGET_FILENAME = path.resolve('../site/src/top-list.json');

export default async function saveTopList(
  albums: (Album & { places: TagListItem[]; tags: AlbumTag[] })[],
): Promise<void> {
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
