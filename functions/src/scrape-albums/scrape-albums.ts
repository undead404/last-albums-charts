import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongodb from '../common/mongo-database';
import { TagRecord } from '../common/types';

import pickTag from './pick-tag';
import scrapeAlbumsByTag from './scrape-albums-by-tag';

export default async function scrapeAlbums(): Promise<void> {
  const start = new Date();
  const tag = await pickTag();
  if (!tag) {
    logger.error('Failed to find a tag to scrape albums by');
    return;
  }
  try {
    await scrapeAlbumsByTag(tag);
    const tagUpdate: Partial<TagRecord> = {
      lastProcessedAt: new Date(),
    };
    await mongodb.tags.updateOne({ name: tag.name }, { $set: tagUpdate });
    logger.info(`scrapeAlbums: ${tag.name} - success`);
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: tag.name,
      title: 'scrapeAlbums',
    });
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: tag.name,
      title: 'scrapeAlbums',
    });
    throw error;
  }
}
