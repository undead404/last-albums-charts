import fs from 'fs';
import path from 'path';

import forEach from 'lodash/forEach';
import join from 'lodash/join';
import map from 'lodash/map';
import replace from 'lodash/replace';
import lunr from 'lunr';

import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

const TARGET_FILENAME = path.resolve('../ssg/source/client/search-index.json');

type TagItem = Pick<TagRecord, 'name' | 'topAlbums'>;

function tagToLunrItem(tag: TagItem) {
  return {
    name: replace(tag.name, '"', '\\"'),
    text: join(
      map(tag.topAlbums, (album) =>
        replace(`${album.artist} - ${album.name}`, /"/g, '\\"'),
      ),
      ', ',
    ),
  };
}

export default async function generatePosts(): Promise<void> {
  const tags = await mongoDatabase.tags
    .find<TagItem>(
      { topAlbums: { $ne: null } },
      {
        projection: {
          _id: false,
          name: true,
          topAlbums: true,
        },
        sort: {
          listCreatedAt: -1,
        },
      },
    )
    .toArray();
  const posts = map(tags, tagToLunrItem);
  const searchIndex = lunr(function configure() {
    this.ref('name');
    this.field('name');
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
