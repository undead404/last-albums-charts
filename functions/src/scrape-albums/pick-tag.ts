import { Album, Tag, TagListItem } from '.prisma/client';

import prisma from '../common/prisma';

export default async function pickTag(): Promise<
  (Tag & { list: (TagListItem & { album: Album })[] }) | null
> {
  return (
    (await prisma.tag.findFirst({
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
        albumsScrapedAt: null,
      },
    })) ||
    prisma.tag.findFirst({
      include: {
        list: {
          include: {
            album: true,
          },
        },
      },
      orderBy: [
        {
          albumsScrapedAt: 'asc',
        },
      ],
    })
  );
}
