import reject from 'lodash/reject';
import sumBy from 'lodash/sumBy';
import toInteger from 'lodash/toInteger';

import deleteTag from '../common/delete-tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import prisma from '../common/prisma';

import pickTag from './pick-tag';

const HUNDRED_MILLIONS = 100_000_000;
const NORMALIZATION = 1 / HUNDRED_MILLIONS;

export default async function populateTagWeight(): Promise<void> {
  const tag = await pickTag();
  if (!tag) {
    logger.warn('No tag to populate weight');
    return;
  }
  if (isTagBlacklisted(tag.name)) {
    logger.warn(`${tag.name} - blacklisted...`);
    await deleteTag(tag.name);
    return;
  }
  logger.info(`populateTagWeight: ${tag.name}`);
  const power = toInteger(
    sumBy(
      reject(tag.albums, 'album.hidden'),
      (albumTag) =>
        albumTag.count *
        (albumTag.album.playcount || 0) *
        (albumTag.album.listeners || 0) *
        NORMALIZATION,
    ),
  );
  if (power === 0) {
    logger.warn(`${tag.name} - empty...`);
    await deleteTag(tag.name);
  } else {
    await prisma.tag.update({ data: { power }, where: { name: tag.name } });
  }
}
