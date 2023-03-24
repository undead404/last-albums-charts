import SQL from '@nearform/sql';
import _ from 'lodash';

import database from '../database/index.js';
import logger from '../logger.js';
import sleep from '../sleep.js';
import type { Album } from '../types.js';

import getFromDiscogs from './get-from-discogs.js';
import getFromMusicbrainz from './get-from-musicbrainz.js';

const { head, includes, toString } = _;

const API_DELAY_MS = 5000;

export default async function populateAlbumDate(
  album: Album,
): Promise<Album | null> {
  if (album.date) {
    return album;
  }
  logger.debug(`populateAlbumDate: ${album.artist} - ${album.name}`);
  let date: null | string = null;

  try {
    date = await getFromMusicbrainz(album);
    if (!date) {
      date = await getFromDiscogs(
        album.artist,
        album.name,
        // eslint-disable-next-line no-magic-numbers
        album.date?.slice(0, 4),
      );
    }
    if (!date) {
      return null;
    }

    const query = SQL`
      UPDATE "Album"
      SET "date" = ${date}
      WHERE "artist" = ${album.artist}
      AND "name" = ${album.name}
      RETURNING *`;

    // eslint-disable-next-line no-console
    // console.info(query.sql);
    const result = await database.query<Album>(query);

    // logger.debug(result.rows);
    return head(result.rows) || null;
  } catch (error: any) {
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
