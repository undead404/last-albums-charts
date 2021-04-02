import includes from 'lodash/includes';
import toString from 'lodash/toString';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import sleep from '../common/sleep';
import { SerializableAlbum } from '../common/types';

import getFromDiscogs from './get-from-discogs';
import getFromMusicbrainz from './get-from-musicbrainz';

export type PopulateAlbumDatePayload = Pick<
  SerializableAlbum,
  'artist' | 'mbid' | 'name'
>;

const API_DELAY_MS = 5000;
async function storeEmpty(album: PopulateAlbumDatePayload): Promise<void> {
  await mongoDatabase.albums.updateOne(
    { mbid: album.mbid },
    { $set: { date: null } },
  );
}

export default async function populateAlbumDate(
  album: PopulateAlbumDatePayload,
): Promise<void> {
  logger.info(`populateAlbumDate: ${album.artist} - ${album.name}`);
  if (!album.mbid) {
    return;
  }
  let date: null | string = null;
  try {
    date = await getFromMusicbrainz(album);
    if (!date) {
      date = await getFromDiscogs(album.artist, album.name);
    }
    await mongoDatabase.albums.updateOne(
      { mbid: album.mbid },
      { $set: { date } },
    );
  } catch (error) {
    if (includes(error.message, 'rate limit')) {
      await sleep(API_DELAY_MS);
      await publish('newAlbums', album);
    } else {
      await storeEmpty(album);
    }
    logger.error(toString(error));
    logger.error(`Failed to get date for: ${album.artist} - ${album.name}`);
  }
}
