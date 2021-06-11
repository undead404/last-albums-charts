import logger from '../common/logger';
import populateAlbumStats from '../common/populate-album-stats';
import populateAlbumTags from '../common/populate-album-tags';
import prisma from '../common/prisma';
import sequentialAsyncForEach from '../common/sequential-async-for-each';
import { AlbumAmqpPayload } from '../common/types';

const LIMIT_FOR_ONE_SHOT = 1000;

export default async function fixAlbums(): Promise<void> {
  logger.debug('fixAlbums()');
  const albums: AlbumAmqpPayload[] = await prisma.album.findMany({
    select: {
      artist: true,
      mbid: true,
      name: true,
      tags: true,
    },
    take: LIMIT_FOR_ONE_SHOT,
    where: {
      OR: [
        {
          listeners: null,
        },
        {
          tags: {
            none: {},
          },
        },
      ],
      hidden: false,
    },
  });
  logger.debug(`fixAlbums: ${albums.length} albums found to fix`);

  await sequentialAsyncForEach(albums, async (album) => {
    await populateAlbumStats(album);
    await populateAlbumTags(album);
  });
}
