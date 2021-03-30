import head from 'lodash/head';

import mongoDatabase from '../common/mongo-database';
import { TagRecord, Weighted } from '../common/types';

export default async function pickTag(): Promise<TagRecord | null> {
  let [tag]: (TagRecord | undefined)[] = await mongoDatabase.tags
    .find({
      lastProcessedAt: null,
    })
    .sort({
      power: -1,
    })
    .limit(1)
    .toArray();
  if (!tag) {
    tag = head(
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
                          $ifNull: [
                            '$lastProcessedAt',
                            Date.parse('2021-03-17'),
                          ],
                        },
                      ],
                    },
                  },
                  '$power',
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
  }
  return tag || null;
}
