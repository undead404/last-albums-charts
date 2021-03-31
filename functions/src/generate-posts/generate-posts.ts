import fs from 'fs';
import path from 'path';

import filenamify from 'filenamify';
import map from 'lodash/map';
import size from 'lodash/size';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import Mustache from 'mustache';

import getTags from './get-tags';
import logger from '../common/logger';

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
      const albums = map(tag.topAlbums, (album, index) => ({
        artist: album.artist,
        date: album.date,
        name: album.name,
        number: index + 1,
      }));
      const firstAlbums = take(albums, NUMBER_OF_ALBUMS_TO_PREVIEW);
      logger.debug(firstAlbums);
      const restAlbums = takeRight(
        albums,
        size(albums) - NUMBER_OF_ALBUMS_TO_PREVIEW,
      );
      const postText = Mustache.render(template, {
        firstAlbums,
        restAlbums,
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
