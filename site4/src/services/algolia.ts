import algoliasearch from 'algoliasearch/lite';

if (!import.meta.env.PUBLIC_ALGOLIA_APP_ID) {
  throw new Error('PUBLIC_ALGOLIA_APP_ID missing');
}

if (!import.meta.env.PUBLIC_ALGOLIA_API_KEY) {
  throw new Error('PUBLIC_ALGOLIA_API_KEY missing');
}
const searchClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APP_ID,
  import.meta.env.PUBLIC_ALGOLIA_API_KEY,
);

export default searchClient;
