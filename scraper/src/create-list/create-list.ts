import _ from 'lodash';

import generateList from '../common/generate-list.js';
import logger from '../common/logger.js';
import removeTagDuplicates from '../common/remove-tag-duplicates.js';
import type { Tag } from '../common/types.js';

import pickTag from './pick-tag.js';

const { includes } = _;

export default async function createList(): Promise<void> {
  logger.debug('createList: start');
  let tag: Tag | null = null;
  tag = await pickTag();
  if (!tag) {
    logger.warn('Failed to find sufficient tag');
    return;
  }

  const removedDuplicates = await removeTagDuplicates(tag.name);

  if (includes(removedDuplicates, tag.name)) {
    logger.warn(`${tag.name} - removed as a duplicate`);
    await createList();
    return;
  }
  await generateList(tag);
}
