import fs from 'node:fs';
import path from 'node:path';

import filenamifyCombined from 'filenamify';
import rimraf from 'rimraf';

import logger from '../common/logger.js';
import sequentialAsyncForEach from '../common/sequential-async-for-each.js';
import type { TagPayload } from '../common/types.js';


export default async function saveTags(tags: TagPayload[]): Promise<void> {
  logger.debug('saveTags()');

  await rimraf(`../site4/data/**/*.json`);

  return sequentialAsyncForEach(tags, async (tag) => {
    const targetFilename = path.resolve(
      `../site4/data/${filenamifyCombined(tag.name)}.json`,
    );
    logger.debug(targetFilename);
    return new Promise<void>((resolve, reject) => {
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
      );
    });
  });
}
