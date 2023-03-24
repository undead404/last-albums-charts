import _ from 'lodash';

const { reduce } = _;

export default async function sequentialAsyncForEach<T>(
  collection: readonly T[],
  f: (item: T, index: number) => Promise<void>,
): Promise<void> {
  return reduce(
    collection,
    async (accumulator, item, index) => {
      await accumulator;
      await f(item, index);
    },
    Promise.resolve(),
  );
}
