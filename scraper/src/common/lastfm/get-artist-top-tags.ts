import uniqBy from 'lodash/uniqBy';

import assure from '../assure';
import logger from '../logger';

import acquire from './acquire';
import { ArtistGetTopTagsPayload, Tag } from './api-types';

export default async function getArtistTopTags(
  artistName: string,
): Promise<readonly Tag[]> {
  logger.debug(`artist.getTopTags(${artistName})`);
  assure('artist.getTopTags', { artistName });
  const data = await acquire<ArtistGetTopTagsPayload>({
    artist: artistName,
    method: 'artist.getTopTags',
  });

  const tags = data?.toptags?.tag;

  return uniqBy(tags, 'name');
}
