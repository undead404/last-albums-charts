import axios from 'axios';
import logger from '../logger';
import sleep from '../sleep';
import { CoverArtArchiveResponse } from './cover-art-archive-types';

const API_DELAY_MS = 1000;

let waiter = Promise.resolve();
export default async function getCoverArtInfo(
  mbid: string,
): Promise<CoverArtArchiveResponse | null> {
  await waiter;
  logger.info(`getCoverArtInfo(${mbid})`);
  try {
    const response = await axios.get<CoverArtArchiveResponse>(
      `https://coverartarchive.org/release/${mbid}`,
    );
    return response.data;
  } catch {
    return null;
  } finally {
    waiter = sleep(API_DELAY_MS);
  }
}
