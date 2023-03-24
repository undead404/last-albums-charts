import SQL from '@nearform/sql';
import _ from 'lodash';

import database from '../common/database/index.js';
import { deleteTag } from '../common/database/tag.js';
import isTagBlacklisted from '../common/is-tag-blacklisted.js';
import logToTelegram, {
  escapeTelegramMessage,
} from '../common/log-to-telegram.js';
import logger from '../common/logger.js';
import removeTagDuplicates from '../common/remove-tag-duplicates.js';

import pickTag from './pick-tag.js';
import scrapeAlbumsByTag from './scrape-albums-by-tag.js';

const { includes } = _;

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
  await logToTelegram(
    `\\#scrape\\_albums\nУспішно зібрано альбоми для тега *${escapeTelegramMessage(
      tag.name,
    )}*`,
  );
}
