import fs from 'node:fs/promises';
import path from 'node:path';

import logger from '../common/logger.js';
import type { Album, Weighted } from '../common/types.js';

const TARGET_FILENAME = path.resolve('../site4/data/top-list.json');

export default async function saveTopList(
  albums: Weighted<Album>[],
): Promise<void> {
  logger.debug('saveTopList()');
  logger.debug('TARGET_FILENAME', TARGET_FILENAME);
  return fs.writeFile(TARGET_FILENAME, JSON.stringify(albums), { flag: 'w' });
}
