import algoliasearch from 'algoliasearch';

// import logger from './logger';

// const { NEXT_PUBLIC_ALGOLIA_API_KEY, NEXT_PUBLIC_ALGOLIA_APP_ID } = process.env;
// console.info(process.env);
// API keys below contain actual values tied to your Algolia account
if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
  throw new Error('Algolia app id not defined');
}
if (!process.env.NEXT_PUBLIC_ALGOLIA_API_KEY) {
  throw new Error('Algolia API key not defined');
}
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
);
const algoliaIndex = algoliaClient.initIndex('tags');

export default algoliaIndex;
