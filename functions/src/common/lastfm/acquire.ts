import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';
import { stringify } from 'query-string';

import { DEFAULT_PARAMS } from './api-constants';
import { Parameters, Payload } from './api-types';
import { LASTFM_API_ERRORS, MAX_RETRIES } from '../constants';

import sleep from '../sleep';
import logger from '../logger';

const API_DELAY_MS = 1000;

let waiter = Promise.resolve();
export default async function acquire<T extends Payload>(
  parameters: Parameters,
  retry = 0,
): Promise<T | null> {
  await waiter;
  const url = `https://ws.audioscrobbler.com/2.0/?${stringify({
    ...DEFAULT_PARAMS,
    ...parameters,
  })}`;
  logger.warn(url);
  try {
    const response = await axios.get<T>(url, { timeout: 2000 });
    if (isEmpty(response?.data)) {
      throw new Error(response?.data?.message || 'Empty response');
    } else if (response.data.error || isEmpty(response.data)) {
      if (response.data.error === LASTFM_API_ERRORS.INVALID_PARAMETERS) {
        logger.warn(response.data.message);
        return null;
      }
      throw new Error(response.data.message || 'Empty response');
    }
    waiter = sleep(API_DELAY_MS);
    return response.data;
  } catch (error) {
    logger.error(toString(error));
    if (retry >= MAX_RETRIES) {
      throw error;
    }
    logger.warn(`retry #${retry + 1}`);
    // eslint-disable-next-line no-magic-numbers
    if (process.env.NODE_ENV !== 'test') await sleep(2 ** retry * 1000);
    return acquire<T>(parameters, retry + 1);
  }
}
