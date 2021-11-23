import { Discojs } from 'discojs';
import { closest } from 'fastest-levenshtein';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import toString from 'lodash/toString';
import uniq from 'lodash/uniq';

import { DISCOGS_ACCESS_TOKEN } from '../environment';
import logger from '../logger';
import searchDiscogs from '../search-discogs';
import sleep from '../sleep';

const discojs = new Discojs({
  userToken: DISCOGS_ACCESS_TOKEN,
});

const API_DELAY_MS = 2000;

let waiter = Promise.resolve();

function getIdFromResponseResults(
  responseResults: {
    id: number;
    title: string;
  }[],
  artistName: string,
  albumName: string,
): number | undefined {
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

  return titleToId.get(foundTitle);
}

export default async function getFromDiscogs(
  artistName: string,
  albumName: string,
  year?: string,
): Promise<string | null> {
  logger.debug(`getFromDiscogs: ${artistName} - ${albumName}`);
  try {
    await waiter;
    const searchResponse = await searchDiscogs(artistName, albumName, year);
    waiter = sleep(API_DELAY_MS);
    const releaseId = getIdFromResponseResults(
      searchResponse.results,
      artistName,
      albumName,
    );

    if (!releaseId) {
      return null;
    }
    await waiter;
    const albumInfo = await discojs.getRelease(releaseId);
    waiter = sleep(API_DELAY_MS);
    return albumInfo.released || null;
  } catch (error) {
    logger.error(toString(error));
    return null;
  }
}
