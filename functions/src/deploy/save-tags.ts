import fs from 'fs';
import path from 'path';

import sortBy from 'lodash/sortBy';

import logger from '../common/logger';
import prisma from '../common/prisma';

const TARGET_FILENAME = path.resolve('../site/src/tags.json');
const TAGS_LIMIT = 1500;

export default async function saveTags(): Promise<void> {
  logger.debug('saveTags()');
  const tags = sortBy(
    await prisma.tag.findMany({
      include: {
        list: {
          include: {
            album: {
              include: {
                places: true,
                tags: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          power: 'desc',
        },
      ],
      take: TAGS_LIMIT,
      where: {
        NOT: {
          listUpdatedAt: null,
        },
      },
    }),
    ['listUpdatedAt', 'listCheckedAt'],
  );
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(
      TARGET_FILENAME,
      JSON.stringify(
        { tags },
        // eslint-disable-next-line lodash/prefer-lodash-typecheck
        (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
      ),
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    ),
  );
}
