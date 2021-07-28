import SQL from '@nearform/sql';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import toString from 'lodash/toString';

import database from '../common/database';
import getTagTopAlbums from '../common/lastfm/get-tag-top-albums';
import logger from '../common/logger';
import populateAlbumStats from '../common/populate-album-stats';
import populateAlbumTags from '../common/populate-album-tags';
import Progress from '../common/progress';
import sequentialAsyncForEach from '../common/sequential-async-for-each';
import { Album, Tag } from '../common/types';

export default async function scrapeAlbumsByTag(tag: Tag): Promise<void> {
  logger.info(`scrapeAlbumsByTag${tag.name}`);
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
  if (!isEmpty(albumsRecords)) {
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
        logger.error(toString(error));
      }
    });
    await sequentialAsyncForEach(albumsRecords, async (album) => {
      try {
        await populateAlbumStats(album);
      } catch (error) {
        logger.error(toString(error));
      }
      try {
        await populateAlbumTags(album);
      } catch (error) {
        logger.error(toString(error));
      }
      progress.increment();
    });
  }
}
