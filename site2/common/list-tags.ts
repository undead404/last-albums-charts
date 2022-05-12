import { readdir } from 'fs';

import map from 'lodash/map';
import split from 'lodash/split';
import without from 'lodash/without';

import logger from './logger';

export default function listTags(): Promise<string[]> {
  logger.debug('listTags()');
  return new Promise((resolve, reject) =>
    readdir('data', (error, files) => {
      if (error) {
        reject(error);
      }
      resolve(
        without(
          map(files, (filename) => split(filename, '.').slice(0, -1).join('.')),
          'tags',
          'top-list',
          '',
        ),
      );
    }),
  );
}
