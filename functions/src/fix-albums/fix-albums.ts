import map from 'lodash/map';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import prisma from '../common/prisma';
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
  await Promise.all(map(albums, (album) => publish('newAlbums', album)));
}
