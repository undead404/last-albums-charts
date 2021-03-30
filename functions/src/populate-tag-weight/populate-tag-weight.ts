import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import pickTag from './pick-tag';

export default async function populateTagWeight(): Promise<void> {
  const tag = await pickTag();
  if (!tag) {
    logger.warn('No tag to populate weight');
    return;
  }
  logger.info(`populateTagWeight: ${tag.name}`);
  const [{ power }] = await mongoDatabase.albums
    .aggregate<{ power: number }>([
      { $match: { [`tags.${tag.name}`]: { $gt: 0 } } },
      { $group: { _id: null, power: { $sum: `$tags.${tag.name}` } } },
    ])
    .toArray();
  await mongoDatabase.tags.updateOne({ _id: tag._id }, { $set: { power } });
}
