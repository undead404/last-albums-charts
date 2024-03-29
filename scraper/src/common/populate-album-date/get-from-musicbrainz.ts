import { format, parse } from 'date-fns';
import get from 'lodash/get';
import includes from 'lodash/includes';
import startsWith from 'lodash/startsWith';
import { MusicBrainzApi } from 'musicbrainz-api';

import logger from '../logger';
import sleep from '../sleep';
import type { Album } from '../types';

const API_DELAY_MS = 5000;
const musicbrainz = new MusicBrainzApi({
  appContactInfo: 'brute18@gmail.com',
  appName: 'last-albums-charts',
  appVersion: '0.1.0',
});

let waiter = Promise.resolve();

export default async function getFromMusicbrainz(
  album: Pick<Album, 'artist' | 'mbid' | 'name'>,
): Promise<string | null> {
  logger.debug(`getFromMusicbrainz: ${album.artist} - ${album.name}`);
  if (!album.mbid) {
    return null;
  }
  try {
    await waiter;
    const release = await musicbrainz.getRelease(album.mbid, [
      'release-groups',
    ]);

    waiter = sleep(API_DELAY_MS);
    const date =
      get(release, 'release-group.first-release-date') || get(release, 'date');
    if (!date) {
      return null;
    }

    if (includes(date, '/')) {
      return format(parse(date, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
    }
    return date?.replaceAll?.('-00', '') || null;
  } catch (error: any) {
    if (
      startsWith(error.message, 'Got response status 404') ||
      startsWith(error.message, 'Not Found')
    ) {
      return null;
    }
    throw error;
  }
}
