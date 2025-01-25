import { Effect } from 'effect';
import { type InferInput, looseObject, safeParse } from 'valibot';

const schema = looseObject({});
export type ApiResponse = InferInput<typeof schema>;

export class ApiResponseError {
  _tag = 'ApiResponseError';
}

export class ApiJsonError {
  _tag = 'ApiJsonError';
}

export class ApiObjectError {
  _tag = 'ApiObjectError';
}

export type ApiError = ApiResponseError | ApiJsonError | ApiObjectError;

export default function requestApi(url: string) {
  return Effect.tryPromise({
    catch: () => new ApiResponseError(),
    try: () => fetch(url),
  }).pipe(
    Effect.flatMap((response) =>
      Effect.tryPromise({
        catch: () => new ApiJsonError(),
        try: () => response.json(),
      }),
    ),
    Effect.map((data) => safeParse(schema, data)),
    Effect.flatMap(({ output, success }) =>
      success ? Effect.succeed(output) : Effect.fail(new ApiObjectError()),
    ),
  );
}
