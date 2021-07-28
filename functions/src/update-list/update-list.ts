import includes from 'lodash/includes';

import { deleteTag } from '../common/database/tag';
import generateList from '../common/generate-list';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import removeTagDuplicates from '../common/remove-tag-duplicates';

import pickTag from './pick-tag';

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
