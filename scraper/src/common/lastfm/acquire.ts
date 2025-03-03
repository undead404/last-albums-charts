import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';

import { LASTFM_API_ERRORS, MAX_RETRIES } from '../constants.js';
import formatError from '../format-error.js';
import logger from '../logger.js';
import sleep from '../sleep.js';

import { DEFAULT_PARAMS } from './api-constants.js';
import type { Parameters, Payload } from './api-types.js';

const { isEmpty } = _;

const API_DELAY_MS = 1000;

const RESPONSE_TIMEOUT = 2000;
const CONNECTION_TIMEOUT = 5000;

let waiter = Promise.resolve();

export default async function acquire<T extends Payload>(
  parameters: Parameters,
  retry = 0,
): Promise<T | null> {
  await waiter;
  const url = `https://ws.audioscrobbler.com/2.0/?${qs.stringify({
    ...DEFAULT_PARAMS,
    ...parameters,
  })}`;

  logger.debug(url);
  try {
    const abortController = new AbortController();
    const connectionTimeout = setTimeout(() => {
      abortController.abort();
      logger.error('Aborted');
    }, CONNECTION_TIMEOUT);
    const response = await axios.get<T>(url, {
      signal: abortController.signal,
      timeout: RESPONSE_TIMEOUT,
    });
    clearTimeout(connectionTimeout);

    if (isEmpty(response?.data)) {
      throw new Error(response?.data?.message || 'Empty response');
    } else if (response.data.error || isEmpty(response.data)) {
      if (response.data.error === LASTFM_API_ERRORS.INVALID_PARAMETERS) {
        logger.error(response.data.message);
        return null;
      }
      throw new Error(response.data.message || 'Empty response');
    }
    waiter = sleep(API_DELAY_MS);
    return response.data;
  } catch (error) {
    logger.error(formatError(error));
    if (retry >= MAX_RETRIES) {
      throw error;
    }
    logger.warn(`retry #${retry + 1}`);
    // eslint-disable-next-line no-magic-numbers
    if (process.env.NODE_ENV !== 'test') await sleep(2 ** retry * 1000);
    return acquire<T>(parameters, retry + 1);
  }
}
