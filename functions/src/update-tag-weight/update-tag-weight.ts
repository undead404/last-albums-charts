import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import pickTag from './pick-tag';

const HUNDRED_MILLIONS = 100_000_000;
const NORMALIZATION = 1 / HUNDRED_MILLIONS;

export default async function updateTagWeight(): Promise<void> {
  const start = new Date();
  const tag = await pickTag();
  if (!tag) {
    logger.warn('No tag to populate weight');
    return;
  }
  try {
    logger.info(`updateTagWeight: ${tag.name}`);
    const [{ power } = { power: 0 }] = await mongoDatabase.albums
      .aggregate<{ power: number }>(
        [
          {
            $match: {
              [`tags.${tag.name}`]: { $gt: 0 },
              hidden: {
                $ne: true,
              },
            },
          },
          {
            $group: {
              _id: null,
              power: {
                $sum: {
                  $multiply: [
                    `$tags.${tag.name}`,
                    '$playcount',
                    '$listeners',
                    NORMALIZATION,
                  ],
                },
              },
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
    if (power === 0) {
      logger.warn(`${tag.name} - blacklisted...`);
      await mongoDatabase.tags.deleteOne({ _id: tag._id });
    } else {
      await mongoDatabase.tags.updateOne({ _id: tag._id }, { $set: { power } });
    }
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: tag.name,
      title: 'updateTagWeight',
    });
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: tag.name,
      title: 'updateTagWeight',
    });
    throw error;
  }
}
