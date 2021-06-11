import { Album, Tag, TagListItem } from '.prisma/client';

import deleteTag from '../common/delete-tag';
import generateList from '../common/generate-list';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';

import pickTag from './pick-tag';

export default async function updateList(): Promise<void> {
  logger.debug('updateList: start');
  let tag: (Tag & { list: (TagListItem & { album: Album })[] }) | null = null;
  tag = await pickTag();
  if (!tag) {
    logger.warn('Failed to find sufficient tag');
    return;
  }
  if (isTagBlacklisted(tag.name)) {
    logger.warn(`${tag.name} - blacklisted...`);
    await deleteTag(tag.name);
    await updateList();
    return;
  }
  await generateList(tag);
}
