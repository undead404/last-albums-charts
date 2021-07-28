import { Discojs, SearchTypeEnum } from 'discojs';
import includes from 'lodash/includes';
import toString from 'lodash/toString';

import { DISCOGS_ACCESS_TOKEN } from './environment';
import sleep from './sleep';

const discojs = new Discojs({
  userToken: DISCOGS_ACCESS_TOKEN,
});
let waiter = Promise.resolve();
const API_DELAY_MS = 60_000;
const MAX_RETRIES = 1;
export default async function searchDiscogs(
  artist: string,
  name: string,
  year?: string,
  retry = 0,
): Promise<{
  /* eslint-disable camelcase */
  pagination: {
    items: number;
    page: number;
    pages: number;
    per_page: number;
    urls: {
      first?: string | undefined;
      prev?: string | undefined;
      next?: string | undefined;
      last?: string | undefined;
    };
  };
  results: ({
    resource_url: string;
  } & {
    id: number;
    type: SearchTypeEnum;
    title: string;
    thumb: string;
    user_data: {
      in_collection: boolean;
      in_wantlist: boolean;
    };
    cover_image: string;
    master_id: number | null;
    master_url: string | null;
    uri: string;
  })[];
  /* eslint-enable camelcase */
}> {
  await waiter;
  try {
    const result = await discojs.searchRelease('', {
      artist,
      releaseTitle: name,
      type: SearchTypeEnum.RELEASE,
      year,
    });
    if (result.pagination.items === 0 && year) {
      return await discojs.searchRelease('', {
        artist,
        releaseTitle: name,
        type: SearchTypeEnum.RELEASE,
      });
    }
    return result;
  } catch (error) {
    if (
      retry <= MAX_RETRIES &&
      includes(toString(error), 'Too Many Requests')
    ) {
      waiter = sleep(API_DELAY_MS);
      return searchDiscogs(artist, name, year, retry + 1);
    }
    throw error;
  }
}
