import axios from 'axios';

import formatError from './format-error.js';
import logger from './logger.js';

const MIN_ERROR_CODE = 400;

export default async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url);

    if (response.status >= MIN_ERROR_CODE) {
      logger.debug(`checkUrl(${url})`);
      logger.error(new Error(response.statusText));
      return false;
    }

    return true;
  } catch (error) {
    logger.debug(`checkUrl(${url})`);
    logger.error(formatError(error));
    return false;
  }
}
