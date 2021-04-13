import head from 'lodash/head';
import isTagBlacklisted from '../common/is-tag-blacklisted';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { TagRecord, Weighted } from '../common/types';

export default async function pickTag(): Promise<TagRecord | undefined> {
  const tag = head(
    await mongoDatabase.tags
      .aggregate<Weighted<TagRecord>>([
        {
          $match: {
            lastProcessedAt: {
              $ne: null,
            },
          },
        },
        {
          $project: {
            _id: true,
            lastProcessedAt: true,
            listCreatedAt: true,
            name: true,
            power: true,
            topAlbums: true,
            weight: {
              $multiply: [
                {
                  $toLong: {
                    $subtract: [
                      '$$NOW',
                      { $ifNull: ['$listCreatedAt', Date.parse('1970-01-01')] },
                    ],
                  },
                },
                { $sqrt: '$power' },
              ],
            },
          },
        },
        { $sort: { weight: -1 } },
        { $limit: 1 },
      ])
      .toArray(),
  );
  if (!tag) {
    logger.warn('No tags picked');
  } else {
    if (isTagBlacklisted(tag.name)) {
      await mongoDatabase.tags.deleteOne({ name: tag.name });
      return pickTag();
    }
    logger.info(`Picked tag: ${tag.name}`);
  }
  return tag;
}
