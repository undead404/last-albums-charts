import { Discojs, SearchTypeEnum } from 'discojs';
import { closest } from 'fastest-levenshtein';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

import { DISCOGS_ACCESS_TOKEN } from '../common/environment';
import logger from '../common/logger';
import sleep from '../common/sleep';
import { AlbumRecord } from '../common/types';

const discojs = new Discojs({
  userToken: DISCOGS_ACCESS_TOKEN,
});

const API_DELAY_MS = 2000;

let waiter = Promise.resolve();

function getFromResponseResults(
  responseResults: {
    // eslint-disable-next-line camelcase
    cover_image: string;
    id: number;
    thumb: string;
    title: string;
  }[],
  artistName: string,
  albumName: string,
):
  | {
      // eslint-disable-next-line camelcase
      cover_image: string;
      id: number;
      thumb: string;
      title: string;
    }
  | undefined {
  const targetTitle = `${artistName} - ${albumName}`;
  const titleToId = new Map<string, number>();
  forEach(responseResults, (responseResult) => {
    const previousId = titleToId.get(responseResult.title);
    if (previousId) {
      if (previousId > responseResult.id) {
        titleToId.set(responseResult.title, responseResult.id);
      }
    } else {
      titleToId.set(responseResult.title, responseResult.id);
    }
  });
  const foundTitle = closest(targetTitle, uniq(map(responseResults, 'title')));
  return find(responseResults, ['id', titleToId.get(foundTitle)]);
}
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
  const albumSearchItem = getFromResponseResults(
    searchResponse.results,
    artistName,
    albumName,
  );
  if (!albumSearchItem) {
    return null;
  }
  const { cover_image: cover, thumb: thumbnail } = albumSearchItem;
  return { cover, thumbnail };
}
