import _ from 'lodash';

import assure from '../assure.js';
import logger from '../logger.js';

import type { Tag } from './api-types.js';
import getAlbumTopTags from './get-album-top-tags.js';

const { find, toLower } = _;

export default async function getAlbumTagCount(
  albumName: string,
  artistName: string,
  tagName: string,
): Promise<number> {
  logger.debug(`getAlbumTagCount(${albumName}, ${artistName}, ${tagName})`);
  assure('getAlbumTagCount', { albumName, artistName, tagName });
  const albumTags = await getAlbumTopTags(albumName, artistName);
  const tagObject = find(
    albumTags,
    (tagItem: Tag) => toLower(tagItem.name) === toLower(tagName),
  );

  if (!tagObject) {
    return 0;
  }

  return tagObject.count;
}
