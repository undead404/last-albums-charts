import includes from 'lodash/includes';

import { deleteTag } from '../common/database/tag';
import generateList from '../common/generate-list';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import removeTagDuplicates from '../common/remove-tag-duplicates';
import { Tag } from '../common/types';

import pickTag from './pick-tag';

export default async function createList(): Promise<void> {
  logger.debug('createList: start');
  let tag: Tag | null = null;
  tag = await pickTag();
  if (!tag) {
    logger.warn('Failed to find sufficient tag');
    return;
  }
  if (isTagBlacklisted(tag.name)) {
    logger.warn(`${tag.name} - blacklisted...`);
    await deleteTag({ name: tag.name });
    await createList();
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
