import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

import filenamifyCombined from 'filenamify';
import rimraf from 'rimraf';

import logger from '../common/logger';
import sequentialAsyncForEach from '../common/sequential-async-for-each';
import type { TagPayload } from '../common/types';

const rimrafPromised = promisify(rimraf);

export default async function saveTags(tags: TagPayload[]): Promise<void> {
  logger.debug('saveTags()');

  await rimrafPromised(`../site4/data/**/*.json`);

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
