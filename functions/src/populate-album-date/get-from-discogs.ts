import { Discojs, SearchTypeEnum } from 'discojs';
import get from 'lodash/get';

import { DISCOGS_ACCESS_TOKEN } from '../common/environment';
import logger from '../common/logger';

const discojs = new Discojs({
  userToken: DISCOGS_ACCESS_TOKEN,
});

export default async function getFromDiscogs(
  artistName: string,
  albumName: string,
): Promise<string | null> {
  try {
    const searchResponse = await discojs.searchRelease('', {
      artist: artistName,
      releaseTitle: albumName,
      type: SearchTypeEnum.RELEASE,
    });
    const releaseId = get(searchResponse.results[0], 'id');
    const albumInfo = await discojs.getRelease(releaseId);
    return albumInfo.released || null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
