import { format, parse } from 'date-fns';
import { Discojs } from 'discojs';
import { closest } from 'fastest-levenshtein';
import _ from 'lodash';

import { DISCOGS_ACCESS_TOKEN } from '../environment.js';
import formatError from '../format-error.js';
import logger from '../logger.js';
import searchDiscogs from '../search-discogs.js';
import sleep from '../sleep.js';

const { forEach, includes, map, uniq } = _;

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
    if (!albumInfo.released) {
      return null;
    }
    if (includes(albumInfo.released, '/')) {
      return format(
        parse(albumInfo.released, 'dd/MM/yyyy', new Date()),
        'yyyy-MM-dd',
      );
    }
    return albumInfo.released?.replaceAll?.('-00', '') || null;
  } catch (error) {
    logger.error(`getFromDiscogs: ${formatError(error)}`);
    return null;
  }
}
