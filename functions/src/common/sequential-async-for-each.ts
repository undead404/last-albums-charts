import reduce from 'lodash/reduce';

export default async function sequentialAsyncForEach<T>(
  collection: readonly T[],
  f: (item: T) => Promise<void>,
): Promise<void> {
  return reduce(
    collection,
    async (accumulator, item) => {
      await accumulator;
      await f(item);
    },
    Promise.resolve(),
  );
}
