import _ from 'lodash';

export default function formatError(error: unknown): string {
  return _.toString(error);
}
