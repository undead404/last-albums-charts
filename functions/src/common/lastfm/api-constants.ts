import { LASTFM_API_KEY } from '../environment';
import { DefaultParameters } from './api-types';

if (!LASTFM_API_KEY) {
  throw new Error('LASTFM_API_KEY is required');
}

// eslint-disable-next-line import/prefer-default-export
export const DEFAULT_PARAMS: DefaultParameters = {
  api_key: LASTFM_API_KEY,
  autocorrect: '1',
  format: 'json',
};
