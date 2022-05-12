import map from 'lodash/map';
import omit from 'lodash/omit';

import algoliaIndex from '../common/algolia-index';
import logger from '../common/logger';

export default async function saveToAlgolia(tags: any[]): Promise<void> {
  logger.debug('saveToAlgolia(...)');
  await algoliaIndex.replaceAllObjects(
    map(tags, (tag) => omit(tag, ['albums'])),
  );
}
