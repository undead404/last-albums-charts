import axios from 'axios';
import toString from 'lodash/toString';

import logger from './logger';

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
    logger.error(toString(error));
    return false;
  }
}
