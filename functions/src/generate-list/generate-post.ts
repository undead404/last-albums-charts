import fs from 'fs';
import path from 'path';

import filenamify from 'filenamify';
import differenceBy from 'lodash/differenceBy';
import find from 'lodash/find';
import join from 'lodash/join';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import lodashReject from 'lodash/reject';
import size from 'lodash/size';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import toPairs from 'lodash/toPairs';
import Mustache from 'mustache';

import { AlbumRecord, TagRecord } from '../common/types';
import logger from '../common/logger';

const MIN_TAG_COUNT = 50;
const NUMBER_OF_ALBUMS_TO_PREVIEW = 10;
const TARGET_FOLDER = path.resolve('../ssg/source/_posts');

const template = fs
  .readFileSync(path.resolve('../post.md.mustache'))
  .toString();
Mustache.parse(template);

function hashtagify(s: string): string {
  return `#${snakeCase(s)}`;
}
function albumToView(album: AlbumRecord, index: number) {
  const tooltip = join(
    map(
      sortBy(
        lodashReject(
          toPairs(album.tags || undefined),
          ([, tagCount]) => tagCount < MIN_TAG_COUNT,
        ),
        ([, tagCount]) => -tagCount,
      ),
      ([tagName]) => hashtagify(tagName),
    ),
    ' ',
  );
  return {
    artist: album.artist,
    date: album.date,
    name: album.name,
    number: index + 1,
    tooltip,
  };
}

export default async function generatePost(
  tag: TagRecord,
  albums: AlbumRecord[],
): Promise<void> {
  if (
    size(
      differenceBy(
        tag.topAlbums || [],
        albums || [],
        (album) => `${album.artist} - ${album.name}`,
      ),
    ) === 0
  ) {
    logger.warn(`No changes at ${tag.name}`);
    return Promise.resolve();
  }
  const albumsByWeight = orderBy(albums, ['weight'], ['desc']);
  const bestAlbumWithCover = find(albumsByWeight, 'cover');
  const coverSource = bestAlbumWithCover ? bestAlbumWithCover.cover : null;
  const coverTitle = bestAlbumWithCover
    ? `${bestAlbumWithCover.artist} - ${bestAlbumWithCover.name} (${bestAlbumWithCover.date})`
    : null;
  const albumsViews = map(albums, albumToView);
  const previewAlbums = map(
    sortBy(take(albumsByWeight, NUMBER_OF_ALBUMS_TO_PREVIEW), 'date', 'name'),
    albumToView,
  );
  const postText = Mustache.render(template, {
    previewAlbums,
    albums: albumsViews,
    coverSource,
    coverTitle,
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
}
