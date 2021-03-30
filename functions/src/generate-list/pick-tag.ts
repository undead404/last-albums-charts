import head from 'lodash/head';
import logger from '../common/logger';

import mongodb from '../common/mongo-database';
import { TagRecord, Weighted } from '../common/types';

export default async function pickTag(): Promise<TagRecord | undefined> {
  let [tag]: (TagRecord | undefined)[] = (await mongodb.tags
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
    logger.info(`Picked tag: ${tag.name}`);
    return tag;
  }
  tag = head(
    await mongodb.tags
      .aggregate<Weighted<TagRecord>>([
        {
          $project: {
            _id: true,
            lastProcessedAt: true,
            listCreatedAt: true,
            name: true,
            power: true,
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
                '$power',
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
    logger.info(`Picked tag: ${tag.name}`);
  }
  return tag;
}
