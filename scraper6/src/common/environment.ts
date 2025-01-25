import * as v from 'valibot';

const nonEmptyString = v.pipe(v.string(), v.nonEmpty());

const environmentSchema = v.object({
  APP_NAME: nonEmptyString,
  DISCOGS_ACCESS_TOKEN: nonEmptyString,
  LASTFM_API_KEY: nonEmptyString,
  ALGOLIA_API_KEY: nonEmptyString,
  ALGOLIA_APP_ID: nonEmptyString,
  NODE_ENV: v.picklist(['development', 'production']),
});

const environment = v.parse(environmentSchema, process.env);

export default environment;
