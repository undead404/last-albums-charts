import _ from 'lodash';

import { deleteTag } from '../common/database/tag.js';
import generateList from '../common/generate-list.js';
import isTagBlacklisted from '../common/is-tag-blacklisted.js';
import logger from '../common/logger.js';
import removeTagDuplicates from '../common/remove-tag-duplicates.js';

import pickTag from './pick-tag.js';

const { includes } = _;

export default async function updateList(): Promise<void> {
  logger.debug('updateList: start');
  const tag = await pickTag();

  if (!tag) {
    logger.warn('Failed to find sufficient tag');
    return;
  }
  if (isTagBlacklisted(tag.name)) {
    logger.warn(`${tag.name} - blacklisted...`);
    await deleteTag(tag);
    await updateList();
    return;
  }

  const removedDuplicates = await removeTagDuplicates(tag.name);

  if (includes(removedDuplicates, tag.name)) {
    logger.warn(`${tag.name} - removed as a duplicate`);
    await updateList();
    return;
  }
  await generateList(tag);
}
