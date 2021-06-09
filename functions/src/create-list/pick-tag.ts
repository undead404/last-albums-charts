import { Album, Tag, TagListItem } from '.prisma/client';
import { sub } from 'date-fns';

import deleteTag from '../common/delete-tag';
import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import prisma from '../common/prisma';

export default async function pickTag(): Promise<
  | (Tag & {
      list: (TagListItem & {
        album: Album;
      })[];
    })
  | null
> {
  const tag = await prisma.tag.findFirst({
    include: {
      list: {
        include: {
          album: true,
        },
      },
    },
    orderBy: [
      {
        power: 'desc',
      },
    ],
    where: {
      albumsScrapedAt: {
        lt: sub(new Date(), { minutes: 15 }),
      },
      listCheckedAt: null,
      listUpdatedAt: null,
    },
  });
  if (!tag) {
    logger.warn('No tags picked');
  } else {
    if (isTagBlacklisted(tag.name)) {
      logger.warn(`${tag.name} - blacklisted...`);
      await deleteTag(tag.name);
      return pickTag();
    }
    logger.info(`Picked tag: ${tag.name}`);
  }
  return tag;
}
