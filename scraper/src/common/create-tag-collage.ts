import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import filenamify from 'filenamify';
import _ from 'lodash';

import createCollage from './create-collage.js';
import fetchImage from './fetch-image.js';
import logger from './logger.js';
import type { Album, AlbumTag, Weighted } from './types.js';

const { map, sortBy } = _;
const directory = dirname(fileURLToPath(import.meta.url));
const ROOT_FOLDER = path.resolve(path.join(directory, '..', '..', '..'));
const COLLAGES_FOLDER = path.join(
  ROOT_FOLDER,
  'site4',
  'public',
  'tag-collage',
);
const NECESSARY_NUMBER_OF_IMAGES = 9;

export default async function createTagCollage(
  tagName: string,
  albumsTags: Weighted<AlbumTag & { album: Album }>[],
): Promise<void> {
  logger.debug(`createTagCollage(${tagName}, ...)`);
  const imagesForCollage: [Buffer, string][] = [];
  const targetFilename = path.join(
    COLLAGES_FOLDER,
    `${filenamify(tagName)}.jpeg`,
  );
  logger.debug(`targetFilename: ${targetFilename}`);
  // eslint-disable-next-line no-restricted-syntax
  for (const albumTag of sortBy(
    albumsTags,
    (albumTagItem) => -albumTagItem.weight,
  )) {
    if (!albumTag.album.cover) {
      // eslint-disable-next-line no-continue
      continue;
    }
    try {
      if (albumTag.album.date)
        imagesForCollage.push([
          // eslint-disable-next-line no-await-in-loop
          await fetchImage(albumTag.album.cover),
          albumTag.album.date,
        ]);
    } catch (error) {
      logger.error(error);
    }
    if (imagesForCollage.length >= NECESSARY_NUMBER_OF_IMAGES) {
      break;
    }
  }
  if (imagesForCollage.length >= NECESSARY_NUMBER_OF_IMAGES) {
    try {
      await createCollage(
        {
          height: 3,
          imageHeight: 200,
          imageWidth: 200,
          sources: map(sortBy(imagesForCollage, '1'), 0),
          width: 3,
        },
        targetFilename,
      );
    } catch (error) {
      logger.error(error);
    }
  }
}
