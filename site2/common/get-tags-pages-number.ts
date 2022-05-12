import { readdir } from 'fs';

import endsWith from 'lodash/endsWith';
import reduce from 'lodash/reduce';
import startsWith from 'lodash/startsWith';

import logger from './logger';

export default async function getTagsPagesNumber(): Promise<number> {
  logger.debug('getTagsPagesNumber()');
  return new Promise((resolve, reject) =>
    readdir('data/tags-index', (error, files) => {
      if (error) {
        reject(error);
      }
      resolve(
        reduce(
          files,
          (accumulator, filename) => {
            if (!startsWith(filename, 'tags') || !endsWith(filename, '.json')) {
              return accumulator;
            }
            const maybeNumber = Number.parseInt(
              filename.slice('tags'.length, filename.length - '.json'.length),
              10,
            );
            if (!Number.isNaN(maybeNumber) && maybeNumber > accumulator) {
              return maybeNumber;
            }
            return accumulator;
          },
          0,
        ),
      );
    }),
  );
}
