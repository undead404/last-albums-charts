import { Effect } from 'effect';
import { safeParse } from 'valibot';

import requestApi, { ApiError } from '../request-api.js';

import {
  CoverArtArchiveResponse,
  coverArtArchiveResponseSchema,
} from './schema.js';

export class CoverArtArchiveSchemaError {
  _tag = 'CoverArtArchiveSchemaError';
}

export default function getCoverArtInfo(
  mbid: string,
): Effect.Effect<
  CoverArtArchiveResponse,
  ApiError | CoverArtArchiveSchemaError,
  never
> {
  return Effect.logDebug(`getCoverArtInfo(${mbid})`).pipe(
    () => requestApi(`https://coverartarchive.org/release/${mbid}`),
    Effect.map((data) => safeParse(coverArtArchiveResponseSchema, data)),
    Effect.flatMap(({ output, success }) =>
      success
        ? Effect.succeed(output)
        : Effect.fail(new CoverArtArchiveSchemaError()),
    ),
  );
}
