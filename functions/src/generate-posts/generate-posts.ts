import fs from 'fs';
import path from 'path';

import filenamify from 'filenamify';
import map from 'lodash/map';
import Mustache from 'mustache';

import getTags from './get-tags';

const TARGET_FOLDER = path.resolve('../ssg/source/_posts');

export default async function generatePosts(): Promise<void> {
  const template = fs
    .readFileSync(path.resolve('../post.md.mustache'))
    .toString();
  Mustache.parse(template);
  const tags = await getTags();
  await Promise.all(
    map(tags, (tag) => {
      const postText = Mustache.render(template, {
        albums: map(tag.topAlbums, (album, index) => ({
          artist: album.artist,
          name: album.name,
          number: index + 1,
        })),
        title: tag.name,
        updated: tag.listCreatedAt?.toString?.(),
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
