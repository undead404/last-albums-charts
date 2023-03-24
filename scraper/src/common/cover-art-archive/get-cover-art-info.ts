import axios from 'axios';

import logger from '../logger.js';
import sleep from '../sleep.js';

import type { CoverArtArchiveResponse } from './cover-art-archive-types.js';

const API_DELAY_MS = 1000;

let waiter = Promise.resolve();

export default async function getCoverArtInfo(
  mbid: string,
): Promise<CoverArtArchiveResponse | null> {
  await waiter;
  logger.debug(`getCoverArtInfo(${mbid})`);
  try {
    const url = `https://coverartarchive.org/release/${mbid}`;
    logger.debug(url);
    const response = await axios.get<CoverArtArchiveResponse>(url);

    return response.data;
  } catch {
    return null;
  } finally {
    waiter = sleep(API_DELAY_MS);
  }
}
