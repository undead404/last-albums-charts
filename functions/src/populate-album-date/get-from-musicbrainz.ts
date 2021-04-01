import get from 'lodash/get';
import includes from 'lodash/includes';
import startsWith from 'lodash/startsWith';
import { MusicBrainzApi } from 'musicbrainz-api';
import { publish } from '../common/amqp-broker';

import logger from '../common/logger';
import sleep from '../common/sleep';
import { SerializableAlbum } from '../common/types';

const API_DELAY_MS = 5000;
const musicbrainz = new MusicBrainzApi({
  appContactInfo: 'brute18@gmail.com',
  appName: 'last-albums-charts',
  appVersion: '0.1.0',
});

let waiter = Promise.resolve();
export default async function getFromMusicbrainz(
  album: Pick<SerializableAlbum, 'artist' | 'mbid' | 'name'>,
): Promise<string | null> {
  await waiter;
  if (!album.mbid) {
    return null;
  }
  try {
    const release = await musicbrainz.getRelease(album.mbid, [
      'release-groups',
    ]);
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
    if (includes(error.message, 'rate limit')) {
      await sleep(API_DELAY_MS);
      await publish('newAlbums', album);
    }
    logger.error(error.message);
    logger.error(`Failed to get date for: ${album.artist} - ${album.name}`);
  } finally {
    waiter = sleep(API_DELAY_MS);
  }
}
