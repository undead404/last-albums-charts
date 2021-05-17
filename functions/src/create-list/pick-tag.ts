import head from 'lodash/head';

import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { TagRecord } from '../common/types';

export default async function pickTag(): Promise<TagRecord | undefined> {
  const tag = head(
    await mongoDatabase.tags
      .find({
        lastProcessedAt: {
          $ne: null,
        },
        topAlbums: null,
      })
      .sort({ listCreatedAt: 1 })
      .limit(1)
      .toArray(),
  );
  if (!tag) {
    logger.warn('No tags picked');
  } else {
    if (isTagBlacklisted(tag.name)) {
      logger.warn(`${tag.name} - blacklisted...`);
      await mongoDatabase.tags.deleteOne({ name: tag.name });
      return pickTag();
    }
    logger.info(`Picked tag: ${tag.name}`);
  }
  return tag;
}
