import { format, parse } from 'date-fns';
import _ from 'lodash';
import { MusicBrainzApi } from 'musicbrainz-api';

import logger from '../logger.js';
import sleep from '../sleep.js';
import type { Album } from '../types.js';

const { get, includes, startsWith } = _;

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
    const release = await musicbrainz.lookupRelease(album.mbid, [
      'release-groups',
    ]);

    waiter = sleep(API_DELAY_MS);
    const date =
      get(release, 'release-group.first-release-date') || get(release, 'date');
    if (!date || date === 'Unknown') {
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
