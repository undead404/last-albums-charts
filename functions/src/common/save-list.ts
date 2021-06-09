import { Album, Tag, TagListItem } from '.prisma/client';
import map from 'lodash/map';
import some from 'lodash/some';

import logger from './logger';
import prisma from './prisma';

function didAlbumsChange(
  tag: Tag & { list: (TagListItem & { album: Album })[] },
  albums?: Album[],
): boolean {
  if (!albums && !tag.list) {
    return false;
  }
  if (!albums || !tag.list) {
    return true;
  }
  return some(albums, (listAlbum, index) => {
    const tagAlbum = tag.list?.[index];
    return (
      !tagAlbum ||
      listAlbum.artist !== tagAlbum.albumArtist ||
      listAlbum.name !== tagAlbum.albumArtist ||
      // chartAlbum.cover !== tagAlbum.cover ||
      // chartAlbum.thumbnail !== tagAlbum.thumbnail ||
      listAlbum.date !== tagAlbum.album.date
    );
  });
}
export default async function saveList(
  tag: Tag & { list: (TagListItem & { album: Album })[] },
  albums?: Album[],
): Promise<void> {
  if (!albums || !didAlbumsChange(tag, albums)) {
    logger.debug(`${tag.name}: no changes`);
    await prisma.tag.update({
      data: {
        listCheckedAt: new Date(),
      },
      where: {
        name: tag.name,
      },
    });
  } else {
    // await new Promise<void>((resolve, reject) =>
    //   fs.writeFile(
    //     `${filenamify(tag.name)}.json`,
    //     JSON.stringify(albums),
    //     (error) => {
    //       if (error) {
    //         reject(error);
    //       } else {
    //         resolve();
    //       }
    //     },
    //   ),
    // );
    await prisma.$transaction([
      prisma.tag.update({
        data: {
          list: {
            deleteMany: {},
          },
        },
        where: {
          name: tag.name,
        },
      }),
      prisma.tagListItem.createMany({
        data: map(albums, (album, index) => ({
          albumArtist: album.artist,
          albumName: album.name,
          place: index + 1,
          tagName: tag.name,
        })),
      }),
      prisma.tag.update({
        data: {
          listCheckedAt: new Date(),
          listUpdatedAt: new Date(),
        },
        where: {
          name: tag.name,
        },
      }),
    ]);
  }
}
