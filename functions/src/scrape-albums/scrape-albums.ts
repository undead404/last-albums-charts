import SQL from '@nearform/sql';
import includes from 'lodash/includes';

import database from '../common/database';
import { deleteTag } from '../common/database/tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import removeTagDuplicates from '../common/remove-tag-duplicates';

import pickTag from './pick-tag';
import scrapeAlbumsByTag from './scrape-albums-by-tag';

export default async function scrapeAlbums(): Promise<void> {
  logger.debug('scrapeAlbums()');
  const tag = await pickTag();
  if (!tag) {
    logger.error('Failed to find a tag to scrape albums by');
    return;
  }
  if (isTagBlacklisted(tag.name)) {
    await deleteTag(tag);
    await scrapeAlbums();
    return;
  }
  const removedDuplicates = await removeTagDuplicates(tag.name);
  if (includes(removedDuplicates, tag.name)) {
    logger.warn(`${tag.name} - removed as a duplicate`);
    await scrapeAlbums();
    return;
  }
  await scrapeAlbumsByTag(tag);
  await database.query(SQL`
    UPDATE "Tag"
    SET "albumsScrapedAt" = NOW()
    WHERE "name" = ${tag.name}
  `);
  logger.debug(`scrapeAlbums: ${tag.name} - success`);
}
