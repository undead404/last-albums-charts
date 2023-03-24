import _ from 'lodash';

import assure from '../assure.js';
import logger from '../logger.js';

import acquire from './acquire.js';
import type { ArtistGetTopTagsPayload, Tag } from './api-types.js';

const { uniqBy } = _;

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
