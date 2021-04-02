import { Discojs, SearchTypeEnum } from 'discojs';
import get from 'lodash/get';
import toString from 'lodash/toString';

import { DISCOGS_ACCESS_TOKEN } from '../common/environment';
import logger from '../common/logger';
import sleep from '../common/sleep';

const discojs = new Discojs({
  userToken: DISCOGS_ACCESS_TOKEN,
});

const API_DELAY_MS = 2000;

let waiter = Promise.resolve();

export default async function getFromDiscogs(
  artistName: string,
  albumName: string,
): Promise<string | null> {
  logger.debug(`getFromDiscogs: ${artistName} - ${albumName}`);
  try {
    await waiter;
    const searchResponse = await discojs.searchRelease('', {
      artist: artistName,
      releaseTitle: albumName,
      type: SearchTypeEnum.RELEASE,
    });
    waiter = sleep(API_DELAY_MS);
    const releaseId = get(searchResponse.results[0], 'id');
    const albumInfo = await discojs.getRelease(releaseId);
    return albumInfo.released || null;
  } catch (error) {
    logger.error(toString(error));
    return null;
  }
}
