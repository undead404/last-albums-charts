import SQL from '@nearform/sql';
import _ from 'lodash';

import database from '../common/database/index.js';
import getTagTopAlbums from '../common/lastfm/get-tag-top-albums.js';
import logger from '../common/logger.js';
import populateAlbumStats from '../common/populate-album-stats.js';
import populateAlbumTags from '../common/populate-album-tags.js';
import Progress from '../common/progress.js';
import sequentialAsyncForEach from '../common/sequential-async-for-each.js';
import type { Album, Tag } from '../common/types.js';

const { isEmpty, map, toString } = _;

export default async function scrapeAlbumsByTag(tag: Tag): Promise<void> {
  logger.info(`scrapeAlbumsByTag(${tag.name})`);
  const albums = await getTagTopAlbums(tag.name);
  const albumsRecords = map(
    albums,
    (album): Album => ({
      artist: album.artist,
      cover: null,
      date: null,
      duration: null,
      hidden: false,
      mbid: album.mbid || null,
      listeners: null,
      name: album.name,
      numberOfTracks: null,
      playcount: null,
      registeredAt: new Date(),
      thumbnail: null,
    }),
  );

  logger.info(
    `scrapeAlbumsByTag(${tag.name}): ${albumsRecords.length} albums scraped`,
  );
  if (isEmpty(albumsRecords)) {
    return;
  }
  const progress = new Progress(
    albums.length,
    0,
    `scrapeAlbumsByTag - ${albums.length} for ${tag.name}`,
    logger,
  );

  await sequentialAsyncForEach(albumsRecords, async (album) => {
    try {
      await database.query(SQL`
          INSERT INTO "Album"("artist", "mbid", "name")
          VALUES(${album.artist}, ${album.mbid}, ${album.name})
          ON CONFLICT("artist", "name")
          DO NOTHING
        `);
    } catch (error) {
      logger.error(`album insert: ${toString(error)}`);
    }
  });
  await sequentialAsyncForEach(albumsRecords, async (album) => {
    try {
      await populateAlbumStats(album, true);
    } catch (error) {
      logger.error(`populateAlbumStats: ${toString(error)}`);
    }
    try {
      await populateAlbumTags(album, true);
    } catch (error) {
      logger.error(`populateAlbumTags: ${toString(error)}`);
    }
    progress.increment();
  });
}
