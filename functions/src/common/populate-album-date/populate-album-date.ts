import { Album } from '.prisma/client';
import includes from 'lodash/includes';
import toString from 'lodash/toString';

import logger from '../logger';
import prisma from '../prisma';
import sleep from '../sleep';

import getFromDiscogs from './get-from-discogs';
import getFromMusicbrainz from './get-from-musicbrainz';

const API_DELAY_MS = 5000;

export default async function populateAlbumDate(
  album: Album,
): Promise<Album | null> {
  if (album.date) {
    return album;
  }
  logger.info(`populateAlbumDate: ${album.artist} - ${album.name}`);
  let date: null | string = null;
  try {
    date = await getFromMusicbrainz(album);
    if (!date) {
      date = await getFromDiscogs(album.artist, album.name);
    }
    if (!date) {
      return null;
    }
    return await prisma.album.update({
      data: {
        date,
      },
      where: {
        artist_name: {
          artist: album.artist,
          name: album.name,
        },
      },
    });
  } catch (error) {
    if (includes(error.message, 'rate limit')) {
      logger.warn('Rate limit... Delaying');
      await sleep(API_DELAY_MS);
      return populateAlbumDate(album);
    }
    logger.error(toString(error));
    logger.error(`Failed to get date for: ${album.artist} - ${album.name}`);
    return null;
  }
}
