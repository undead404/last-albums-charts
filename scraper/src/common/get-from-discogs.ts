import { closest } from 'fastest-levenshtein';
import _ from 'lodash';

import logger from './logger.js';
import searchDiscogs from './search-discogs.js';
import sleep from './sleep.js';
import type { Album } from './types.js';

const { find, forEach, map, uniq } = _;

let waiter = Promise.resolve();
const API_DELAY_MS = 2000;

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
  year?: string,
): Promise<Pick<Album, 'cover' | 'thumbnail'> | null> {
  logger.debug(`getFromDiscogs: ${artistName} - ${albumName}`);
  await waiter;
  const searchResponse = await searchDiscogs(artistName, albumName, year);
  const albumSearchItem = getFromResponseResults(
    searchResponse.results,
    artistName,
    albumName,
  );

  waiter = sleep(API_DELAY_MS);
  if (!albumSearchItem) {
    return null;
  }

  const { cover_image: cover, thumb: thumbnail } = albumSearchItem;

  return { cover, thumbnail };
}
