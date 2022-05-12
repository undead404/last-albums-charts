import fs from 'fs';
import path from 'path';

import filenamifyCombined from 'filenamify';

import logger from '../common/logger';
import sequentialAsyncForEach from '../common/sequential-async-for-each';
import type { TagPayload } from '../common/types';

export default async function saveTags(tags: TagPayload[]): Promise<void> {
  logger.debug('saveTags()');

  return sequentialAsyncForEach(tags, async (tag) => {
    const targetFilename = path.resolve(
      `../site2/data/${filenamifyCombined(tag.name)}.json`,
    );
    logger.debug(targetFilename);
    return new Promise<void>((resolve, reject) =>
      fs.writeFile(
        targetFilename,
        JSON.stringify(
          tag,
          (key, value) =>
            // eslint-disable-next-line lodash/prefer-lodash-typecheck
            typeof value === 'bigint' ? value.toString() : value, // return everything else unchanged
        ),
        { flag: 'w' },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      ),
    );
  });
}
