import _ from 'lodash';

const { forEach } = _;

export default function assure(
  where: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: { [key: string]: any },
): void {
  forEach(values, (value, key) => {
    if (!value) {
      throw new Error(`No ${key} supplied to ${where}`);
    }
  });
}
