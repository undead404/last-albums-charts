import algoliasearch, {
  AlgoliaSearchOptions,
  SearchClient,
} from 'algoliasearch';

import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from './environment.js';

const algolia = algoliasearch as unknown as (
  appId: string,
  apiKey: string,
  options?: AlgoliaSearchOptions,
) => SearchClient;
// API keys below contain actual values tied to your Algolia account
if (!ALGOLIA_APP_ID) {
  throw new Error('Algolia app id not defined');
}
if (!ALGOLIA_API_KEY) {
  throw new Error('Algolia API key not defined');
}
const algoliaClient = algolia(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const algoliaIndex = algoliaClient.initIndex('tags');

export default algoliaIndex;
