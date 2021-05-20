import { publish } from '../common/amqp-broker';
import generateList from '../common/generate-list';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import mongodb from '../common/mongo-database';
import { TagRecord } from '../common/types';

import pickTag from './pick-tag';

export default async function createList(): Promise<void> {
  logger.debug('createList: start');
  const start = new Date();
  let tagRecord: TagRecord | undefined;
  try {
    if (!mongodb.isConnected) {
      await mongodb.connect();
    }
    tagRecord = await pickTag();
    if (!tagRecord) {
      logger.warn('Failed to find sufficient tag');
      return;
    }
    if (isTagBlacklisted(tagRecord.name)) {
      logger.warn(`${tagRecord.name} - blacklisted...`);
      await mongodb.tags.deleteOne({ name: tagRecord.name });
      await createList();
      return;
    }
    await generateList(tagRecord);
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: tagRecord?.name,
      title: 'createList',
    });
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: tagRecord?.name,
      title: 'createList',
    });
    throw error;
  }
}
