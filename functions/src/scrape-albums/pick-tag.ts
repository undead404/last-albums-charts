import head from 'lodash/head';

import mongoDatabase from '../common/mongo-database';
import { TagRecord, Weighted } from '../common/types';

export default async function pickTag(): Promise<TagRecord | null> {
  // let [tag]: (TagRecord | undefined)[] = await mongoDatabase.tags
  //   .find({
  //     lastProcessedAt: null,
  //   })
  //   .sort({
  //     power: -1,
  //   })
  //   .limit(1)
  //   .toArray();
  // if (!tag) {
  const tag = head(
    await mongoDatabase.tags
      .aggregate<Weighted<TagRecord>>([
        {
          $project: {
            name: true,
            lastProcessedAt: true,
            listCreatedAt: true,
            power: true,
            weight: {
              $multiply: [
                {
                  $toLong: {
                    $subtract: [
                      '$$NOW',
                      {
                        $ifNull: ['$lastProcessedAt', Date.parse('1970-01-01')],
                      },
                    ],
                  },
                },
                { $sqrt: '$power' },
              ],
            },
          },
        },
        {
          $sort: {
            weight: -1,
          },
        },
        { $limit: 1 },
      ])
      .toArray(),
  );
  // }
  return tag || null;
}
