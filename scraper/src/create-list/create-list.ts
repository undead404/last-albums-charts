import includes from 'lodash/includes';

import generateList from '../common/generate-list';
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

  const removedDuplicates = await removeTagDuplicates(tag.name);

  if (includes(removedDuplicates, tag.name)) {
    logger.warn(`${tag.name} - removed as a duplicate`);
    await createList();
    return;
  }
  await generateList(tag);
}
