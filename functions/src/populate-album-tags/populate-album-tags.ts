import map from 'lodash/map';

import getAlbumTopTags from '../common/lastfm/get-album-top-tags';
import logger from '../common/logger';
import prisma from '../common/prisma';
import { AlbumAmqpPayload } from '../common/types';

import normalizeTags from './normalize-tags';

export default async function populateAlbumTags(
  album: AlbumAmqpPayload,
): Promise<void> {
  logger.info(`populateAlbumTags: ${album.artist} - ${album.name}`);
  const tagsObjects = await getAlbumTopTags(album.name, album.artist);
  const albumRecord = await prisma.album.findUnique({
    where: {
      artist_name: {
        artist: album.artist,
        name: album.name,
      },
    },
  });
  if (!albumRecord) {
    logger.warn(
      `${album.artist} - ${album.name}: album already erased from db`,
    );
    return;
  }
  const tags = normalizeTags(tagsObjects);
  await prisma.$transaction(
    map(tags, (tagCount, tagName) => {
      return prisma.albumTag.upsert({
        create: {
          album: {
            connect: {
              artist_name: {
                artist: album.artist,
                name: album.name,
              },
            },
          },
          tag: {
            connectOrCreate: {
              create: {
                albumsScrapedAt: null,
                listCheckedAt: null,
                name: tagName,
                power: 0,
                registeredAt: new Date(),
              },
              where: {
                name: tagName,
              },
            },
          },
          count: tagCount,
          weight: 0,
        },
        update: { count: tagCount },
        where: {
          albumArtist_albumName_tagName: {
            albumArtist: album.artist,
            albumName: album.name,
            tagName,
          },
        },
      });
    }),
  );
}
