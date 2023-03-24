import _ from 'lodash';

import assure from '../assure.js';
import logger from '../logger.js';

import acquire from './acquire.js';
import type { AlbumGetTopTagsPayload, Tag } from './api-types.js';
import getArtistTopTags from './get-artist-top-tags.js';

const { isEmpty, uniqBy } = _;

export default async function getAlbumTopTags(
  albumName: string,
  artistName: string,
): Promise<readonly Tag[]> {
  logger.debug(`album.getTopTags(${albumName}, ${artistName})`);
  assure('album.getTopTags', { albumName, artistName });
  const data = await acquire<AlbumGetTopTagsPayload>({
    album: albumName,
    artist: artistName,
    method: 'album.getTopTags',
  });

  const tags = data?.toptags?.tag;

  if (isEmpty(tags)) {
    return getArtistTopTags(artistName);
  }

  return uniqBy(tags, 'name');
}
