import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';

import assure from '../assure';
import logger from '../logger';

import acquire from './acquire';
import { AlbumGetTopTagsPayload, Tag } from './api-types';
import getArtistTopTags from './get-artist-top-tags';

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
