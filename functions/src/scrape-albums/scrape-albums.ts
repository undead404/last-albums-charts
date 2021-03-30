import logger from '../common/logger';
import mongodb from '../common/mongo-database';
import { TagRecord } from '../common/types';

import pickTag from './pick-tag';
import scrapeAlbumsByTag from './scrape-albums-by-tag';

export default async function scrapeAlbums(): Promise<void> {
  const tag = await pickTag();
  if (!tag) {
    logger.error('Failed to find a tag to scrape albums by');
    return;
  }
  await scrapeAlbumsByTag(tag);
  const tagUpdate: Partial<TagRecord> = {
    lastProcessedAt: new Date(),
  };
  await mongodb.tags.updateOne({ name: tag.name }, { $set: tagUpdate });
}
