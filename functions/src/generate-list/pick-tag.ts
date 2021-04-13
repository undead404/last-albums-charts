import isTagBlacklisted from '../common/is-tag-blacklisted';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<TagRecord | undefined> {
  const [tag]: (TagRecord | undefined)[] = (await mongoDatabase.tags
    .find({
      listCreatedAt: null,
      lastProcessedAt: {
        $ne: null,
      },
    })
    .sort({ power: -1 })
    .limit(1)
    .toArray()) as TagRecord[];
  if (tag) {
    if (isTagBlacklisted(tag.name)) {
      await mongoDatabase.tags.deleteOne({ name: tag.name });
      return pickTag();
    }
    logger.info(`Picked tag: ${tag.name}`);
    return tag;
  }
  logger.warn('No tags picked');

  return tag;
}
