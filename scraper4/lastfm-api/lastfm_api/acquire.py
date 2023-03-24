from os import environ
from time import sleep

from loguru import logger
from ratelimit import limits

CONNECTION_TIMEOUT = 5000
RESPONSE_TIMEOUT = 2000
MAX_RETRIES_NUMBER = 3
INVALID_PARAMETERS_ERROR = 6
DEFAULT_PARAMS = {
    "api_key": environ['LASTFM_API_KEY'],
    "autocorrect": '1',
    "format": 'json',
}


@limits(calls=1, period=1)
def acquire(params, retry_number=0):
    full_params = {}
    full_params.update(DEFAULT_PARAMS)
    full_params.update(params)
    url = f'https://ws.audioscrobbler.com/2.0/?{full_params}'
    logger.debug(url)
    try:
        response = requests.get(url, timeout=RESPONSE_TIMEOUT)
        if response.data is None:
            raise Exception(response.data['message'] or 'Empty response')
        elif response.data['error']:
            if response.data['error'] == INVALID_PARAMETERS_ERROR:
                logger.error(response.data['message'])
                return
            raise Exception(response.data['message'] or 'Empty response')
        return response.data
    except Exception as error:
        logger.error(error)
        if retry_number >= MAX_RETRIES_NUMBER:
            raise error
        logger.warning(f'retry #{retry_number + 1}')
        sleep(2 ** retry_number)
        return acquire(params, retry_number+1)
