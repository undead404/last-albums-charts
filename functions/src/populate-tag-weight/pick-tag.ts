import { Album, AlbumTag, Tag } from '.prisma/client';

import prisma from '../common/prisma';

export default async function pickTag(): Promise<
  (Tag & { albums: (AlbumTag & { album: Album })[] }) | null
> {
  return (
    (await prisma.tag.findFirst({
      include: {
        albums: {
          include: {
            album: true,
          },
        },
      },
      where: {
        NOT: {
          listUpdatedAt: null,
        },
        power: 0,
      },
    })) ||
    prisma.tag.findFirst({
      include: {
        albums: {
          include: {
            album: true,
          },
        },
      },
      where: {
        power: 0,
      },
    })
  );
}
