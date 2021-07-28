import get from 'lodash/get';
import startsWith from 'lodash/startsWith';
import { MusicBrainzApi } from 'musicbrainz-api';

import logger from '../logger';
import sleep from '../sleep';
import { Album } from '../types';

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
    return (
      get(release, 'release-group.first-release-date') ||
      get(release, 'date') ||
      null
    );
  } catch (error) {
    if (
      startsWith(error.message, 'Got response status 404') ||
      startsWith(error.message, 'Not Found')
    ) {
      return null;
    }
    throw error;
  }
}
