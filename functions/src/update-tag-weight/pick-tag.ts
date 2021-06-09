import { Album, AlbumTag, Tag } from '.prisma/client';
import toInteger from 'lodash/toInteger';

import prisma from '../common/prisma';

export default async function pickTag(): Promise<
  (Tag & { albums: (AlbumTag & { album: Album })[] }) | null
> {
  const numberOfTags = await prisma.tag.count({
    where: {
      power: {
        gt: 0,
      },
    },
  });
  // logger.debug(`${numberOfTags} tags present`);
  const indexToPick = toInteger(Math.random() * numberOfTags);
  return prisma.tag.findFirst({
    include: {
      albums: {
        include: {
          album: true,
        },
      },
    },
    skip: indexToPick,
    where: {
      power: {
        gt: 0,
      },
    },
  });
}
