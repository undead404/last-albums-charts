import fs from 'fs';
import path from 'path';

import filenamify from 'filenamify';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import Mustache from 'mustache';

import getTags from './get-tags';

const NUMBER_OF_ALBUMS_TO_PREVIEW = 10;
const TARGET_FOLDER = path.resolve('../ssg/source/_posts');

export default async function generatePosts(): Promise<void> {
  const template = fs
    .readFileSync(path.resolve('../post.md.mustache'))
    .toString();
  Mustache.parse(template);
  const tags = await getTags();
  await Promise.all(
    map(tags, (tag) => {
      const albumsByWeight = orderBy(tag.topAlbums, ['weight'], ['desc']);
      const thumbnailSource = get(
        find(albumsByWeight, 'thumbnail'),
        'thumbnail',
      );
      const albums = map(tag.topAlbums, (album, index) => ({
        artist: album.artist,
        date: album.date,
        name: album.name,
        number: index + 1,
      }));
      const previewAlbums = map(
        sortBy(
          take(albumsByWeight, NUMBER_OF_ALBUMS_TO_PREVIEW),
          'date',
          'name',
        ),
        (album, index) => ({
          artist: album.artist,
          date: album.date,
          name: album.name,
          number: index + 1,
        }),
      );
      const postText = Mustache.render(template, {
        previewAlbums,
        albums,
        thumbnail: thumbnailSource,
        title: tag.name,
        updated: tag.listCreatedAt?.toISOString?.(),
      });
      return new Promise<void>((resolve, reject) =>
        fs.writeFile(
          path.join(TARGET_FOLDER, `${filenamify(tag.name)}.md`),
          postText,
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          },
        ),
      );
    }),
  );
}
