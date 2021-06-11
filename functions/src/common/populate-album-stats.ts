import { Album } from '.prisma/client';
import reject from 'lodash/reject';
import size from 'lodash/size';
import sumBy from 'lodash/sumBy';
import toNumber from 'lodash/toNumber';

import getAlbumInfo from './lastfm/get-album-info';
import logger from './logger';
import prisma from './prisma';
import { AlbumAmqpPayload } from './types';

const MIN_TRACK_LENGTH = 30;

export default async function populateAlbumStats(
  album: AlbumAmqpPayload,
): Promise<void> {
  logger.info(`populateAlbumStats: ${album.artist} - ${album.name}`);
  const albumInfo = await getAlbumInfo(album.name, album.artist);
  if (albumInfo) {
    const originalAlbum = await prisma.album.findUnique({
      where: {
        artist_name: {
          artist: albumInfo.artist,
          name: albumInfo.name,
        },
      },
    });
    if (
      (albumInfo.artist !== album.artist || albumInfo.name !== album.name) &&
      originalAlbum
    ) {
      logger.warn(
        `${album.artist}'s "${album.name}" is a duplicate of ${albumInfo.artist}'s "${albumInfo.name}"`,
      );
      await prisma.$transaction([
        prisma.album.update({
          data: {
            hidden: true,
          },
          where: {
            artist_name: {
              artist: album.artist,
              name: album.name,
            },
          },
        }),
        prisma.album.update({
          data: {
            hidden: false,
          },
          where: {
            artist_name: {
              artist: albumInfo.artist,
              name: albumInfo.name,
            },
          },
        }),
      ]);
      return;
    }
    const albumUpdate: Partial<Album> = {
      // artist: albumInfo.artist,
      duration:
        sumBy(albumInfo.tracks?.track, (track) => toNumber(track.duration)) ||
        null,
      listeners: toNumber(albumInfo.listeners),
      // name: albumInfo.name,
      playcount: toNumber(albumInfo.playcount),
    };
    if (!originalAlbum?.numberOfTracks) {
      albumUpdate.numberOfTracks =
        size(
          reject(
            albumInfo.tracks?.track,
            (track) =>
              track.duration && toNumber(track.duration) < MIN_TRACK_LENGTH,
          ),
        ) || null;
    }
    await prisma.album.update({
      data: albumUpdate,
      where: {
        artist_name: {
          artist: album.artist,
          name: album.name,
        },
      },
    });
  }
}
