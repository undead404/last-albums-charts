import { Album, Tag } from '.prisma/client';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import toString from 'lodash/toString';

import getTagTopAlbums from '../common/lastfm/get-tag-top-albums';
import logger from '../common/logger';
import populateAlbumStats from '../common/populate-album-stats';
import populateAlbumTags from '../common/populate-album-tags';
import prisma from '../common/prisma';
import sequentialAsyncForEach from '../common/sequential-async-for-each';

export default async function scrapeAlbumsByTag(tag: Tag): Promise<void> {
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
      weight: 0,
    }),
  );
  logger.info(
    `scrapeAlbumsByTag(${tag.name}): ${albumsRecords.length} albums scraped`,
  );
  if (!isEmpty(albumsRecords)) {
    await prisma.album.createMany({
      data: albumsRecords,
      skipDuplicates: true,
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
    });
  }
}
