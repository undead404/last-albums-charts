import fs from 'fs';
import path from 'path';

import { Tag, TagListItem } from '.prisma/client';
import forEach from 'lodash/forEach';
import join from 'lodash/join';
import map from 'lodash/map';
import replace from 'lodash/replace';
import lunr from 'lunr';

import logger from '../common/logger';
import prisma from '../common/prisma';

const TARGET_FILENAME = path.resolve('../site/src/search-index.json');

function tagToLunrItem(
  tag: Tag & {
    list: TagListItem[];
  },
) {
  return {
    name: replace(tag.name, '"', '\\"'),
    text: join(
      map(tag.list, (album) =>
        replace(`${album.albumArtist} - ${album.albumName}`, /"/g, '\\"'),
      ),
      ', ',
    ),
  };
}

export default async function generateSearchIndex(): Promise<void> {
  logger.debug('generateSearchIndex()');
  const tags = await prisma.tag.findMany({
    include: {
      list: true,
    },
    orderBy: [
      {
        listUpdatedAt: 'desc',
      },
      {
        listCheckedAt: 'desc',
      },
    ],
    where: {
      NOT: {
        listUpdatedAt: null,
      },
    },
  });
  const posts = map(tags, tagToLunrItem);
  const searchIndex = lunr(function configure() {
    this.ref('name');
    this.field('name', { boost: 10 });
    this.field('text');
    forEach(posts, (post) => {
      this.add(post);
    });
  });
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(TARGET_FILENAME, JSON.stringify(searchIndex), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }),
  );
}
