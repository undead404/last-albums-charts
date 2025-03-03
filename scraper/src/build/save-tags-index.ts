import { writeFile } from 'node:fs';

import _ from 'lodash'; const { chunk } = _;

import sequentialAsyncForEach from '../common/sequential-async-for-each.js';

const PAGE_SIZE = 20;

export default async function saveTagsIndex(tags: unknown[]): Promise<void> {
  await sequentialAsyncForEach(
    // eslint-disable-next-line no-magic-numbers
    chunk(tags, PAGE_SIZE),
    (tagsChunk, index) =>
      new Promise<void>((resolve, reject) => {
        writeFile(
          `../site4/data/tags-index/tags${index + 1}.json`,
          JSON.stringify(
            tagsChunk,
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
      }),
  );
}
