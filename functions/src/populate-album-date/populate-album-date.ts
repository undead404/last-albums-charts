import get from 'lodash/get';
import includes from 'lodash/includes';
import startsWith from 'lodash/startsWith';
import { MusicBrainzApi } from 'musicbrainz-api';
import { publish } from '../common/amqp-broker';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import sleep from '../common/sleep';
import { AlbumRecord, SerializableAlbum } from '../common/types';

export type PopulateAlbumDatePayload = Pick<
  SerializableAlbum,
  'artist' | 'mbid' | 'name'
>;

const API_DELAY_MS = 5000;
const musicbrainz = new MusicBrainzApi({
  appContactInfo: 'brute18@gmail.com',
  appName: 'lastfm-analysis',
  appVersion: '0.1.0',
});

let waiter = Promise.resolve();

export default async function populateAlbumDate(
  album: PopulateAlbumDatePayload,
): Promise<void> {
  logger.info(`populateAlbumDate: ${album.artist} - ${album.name}`);
  if (!album.mbid) {
    return;
  }
  await waiter;
  try {
    const release = await musicbrainz.getRelease(album.mbid, [
      'release-groups',
    ]);
    const date =
      get(release, 'release-group.first-release-date') || get(release, 'date');
    if (date) {
      const albumUpdate: Partial<AlbumRecord> = {
        date,
      };
      await mongoDatabase.albums.updateOne(
        { mbid: album.mbid },
        { $set: albumUpdate },
      );
    } else {
      throw new Error('Not Found');
    }
  } catch (error) {
    if (
      startsWith(error.message, 'Got response status 404') ||
      startsWith(error.message, 'Not Found')
    ) {
      await mongoDatabase.albums.updateOne(
        { mbid: album.mbid },
        { $set: { date: null } },
      );
    } else if (includes(error.message, 'rate limit')) {
      await sleep(API_DELAY_MS);
      await publish('newAlbums', album);
    }
    logger.error(error.message);
    logger.error(`Failed to get date for: ${album.artist} - ${album.name}`);
  }
  waiter = sleep(API_DELAY_MS);
}
