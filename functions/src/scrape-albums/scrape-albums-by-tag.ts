import { Album, Tag } from '.prisma/client';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import toString from 'lodash/toString';

import { publish } from '../common/amqp-broker';
import getTagTopAlbums from '../common/lastfm/get-tag-top-albums';
import logger from '../common/logger';
import prisma from '../common/prisma';

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
  Promise.all(
    map(albumsRecords, async (albumRecord) => {
      const payload = {
        artist: albumRecord.artist,
        mbid: albumRecord.mbid,
        name: albumRecord.name,
      };
      await publish('newAlbums', payload);
    }),
  ).catch((error) => logger.error(toString(error)));
  if (!isEmpty(albumsRecords)) {
    await prisma.album.createMany({
      data: albumsRecords,
      skipDuplicates: true,
    });
  }
}
