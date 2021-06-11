import deleteTag from '../common/delete-tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import prisma from '../common/prisma';

import pickTag from './pick-tag';
import scrapeAlbumsByTag from './scrape-albums-by-tag';

export default async function scrapeAlbums(): Promise<void> {
  const tag = await pickTag();
  if (!tag) {
    logger.error('Failed to find a tag to scrape albums by');
    return;
  }
  if (isTagBlacklisted(tag.name)) {
    await deleteTag(tag.name);
    await scrapeAlbums();
    return;
  }
  await scrapeAlbumsByTag(tag);
  await prisma.tag.update({
    data: {
      albumsScrapedAt: new Date(),
    },
    where: { name: tag.name },
  });
  logger.info(`scrapeAlbums: ${tag.name} - success`);
}
