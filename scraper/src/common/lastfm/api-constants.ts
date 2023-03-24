import { LASTFM_API_KEY } from '../environment.js';

import type { DefaultParameters } from './api-types.js';

if (!LASTFM_API_KEY) {
  throw new Error('LASTFM_API_KEY is required');
}

// eslint-disable-next-line import/prefer-default-export
export const DEFAULT_PARAMS: DefaultParameters = {
  api_key: LASTFM_API_KEY,
  autocorrect: '1',
  format: 'json',
};
