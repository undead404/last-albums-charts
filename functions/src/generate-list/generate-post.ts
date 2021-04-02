import fs from 'fs';
import path from 'path';

import filenamify from 'filenamify';
import every from 'lodash/every';
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

function areAlbumsListsEqual(
  albumList1: AlbumRecord[],
  albumList2: AlbumRecord[],
): boolean {
  if (size(albumList1) !== size(albumList2)) {
    logger.debug(
      `different by size: ${albumList1.length} !== ${albumList2.length}`,
    );
    return false;
  }
  return every(albumList1, (album1, index) => {
    if (album1.artist !== albumList2[index].artist) {
      logger.debug(`${album1.artist} !== ${albumList2[index].artist}`);
      return false;
    }
    if (album1.name !== albumList2[index].name) {
      logger.debug(`${album1.name} !== ${albumList2[index].name}`);
      return false;
    }
    return true;
  });
}

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
  if (areAlbumsListsEqual(tag.topAlbums || [], albums)) {
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
    updated: tag.listCreatedAt?.toISOString?.() || new Date().toISOString(),
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
