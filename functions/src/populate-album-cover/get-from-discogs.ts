import { Discojs, SearchTypeEnum } from 'discojs';
import find from 'lodash/find';

import { DISCOGS_ACCESS_TOKEN } from '../common/environment';
import logger from '../common/logger';
import sleep from '../common/sleep';
import { AlbumRecord } from '../common/types';

const discojs = new Discojs({
  userToken: DISCOGS_ACCESS_TOKEN,
});

const API_DELAY_MS = 2000;

let waiter = Promise.resolve();

export default async function getFromDiscogs(
  artistName: string,
  albumName: string,
): Promise<Pick<AlbumRecord, 'cover' | 'thumbnail'> | null> {
  logger.debug(`getFromDiscogs: ${artistName} - ${albumName}`);
  await waiter;
  const searchResponse = await discojs.searchRelease('', {
    artist: artistName,
    releaseTitle: albumName,
    type: SearchTypeEnum.RELEASE,
  });
  waiter = sleep(API_DELAY_MS);
  const albumSearchItem =
    find(
      searchResponse.results,
      (item) => !!(item.thumb && item.cover_image),
    ) ||
    find(searchResponse.results, (item) => !!(item.thumb || item.cover_image));
  if (!albumSearchItem) {
    return null;
  }
  const { cover_image: cover, thumb: thumbnail } = albumSearchItem;
  return { cover, thumbnail };
}
