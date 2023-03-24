import _ from 'lodash'; const { map } = _;
const { omit } = _;

import algoliaIndex from '../common/algolia-index.js';
import logger from '../common/logger.js';

export default async function saveToAlgolia(
  tags: Record<string, unknown>[],
): Promise<void> {
  logger.debug('saveToAlgolia(...)');
  await algoliaIndex.replaceAllObjects(
    map(tags, (tag) => omit(tag, ['albums'])),
  );
}
