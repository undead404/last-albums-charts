import head from 'lodash/head';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import { WithId } from 'mongodb';

import populateAlbumDate from './populate-album-date/populate-album-date';
import logger from './logger';
import mongodb from './mongo-database';
import populateAlbumsCovers from './populate-albums-covers';
import saveList from './save-list';
import { AlbumRecord, TagRecord, Weighted } from './types';

const AVERAGE_NUMBER_OF_TRACKS = 7;
const AVERAGE_SONG_DURATION = 210;
const AVERAGE_ALBUM_DURATION = AVERAGE_SONG_DURATION * AVERAGE_NUMBER_OF_TRACKS;
const LIST_LENGTH = 100;
const MIN_TAG_COUNT = 0;

const EXTREME_EXP = 3;
const MAX_TAG_COUNT = 100;

// eslint-disable-next-line @typescript-eslint/ban-types
function getProjection(tag: TagRecord): object {
  return {
    $project: {
      artist: true,
      cover: true,
      date: true,
      duration: true,
      listeners: true,
      mbid: true,
      name: true,
      numberOfTracks: true,
      playcount: true,
      tags: true,
      thumbnail: true,
      weight: {
        $multiply: [
          {
            $divide: [
              { $ifNull: ['$playcount', 0] },
              {
                $ifNull: ['$numberOfTracks', AVERAGE_NUMBER_OF_TRACKS],
              },
            ],
          },
          { $ifNull: ['$listeners', 0] },
          {
            $divide: [
              { $ifNull: ['$duration', AVERAGE_ALBUM_DURATION] },
              {
                $ifNull: ['$numberOfTracks', AVERAGE_NUMBER_OF_TRACKS],
              },
            ],
          },
          {
            $pow: [
              { $divide: [`$tags.${tag.name}`, MAX_TAG_COUNT] },
              EXTREME_EXP,
            ],
          },
        ],
      },
    },
  };
}

async function acquireExtraAlbum(
  tag: TagRecord,
  n: number,
): Promise<AlbumRecord | undefined> {
  return head(
    await mongodb.albums
      .aggregate<Weighted<WithId<AlbumRecord>>>(
        [
          {
            $match: {
              [`tags.${tag.name}`]: {
                $gt: MIN_TAG_COUNT,
              },
              hidden: {
                $ne: true,
              },
            },
          },
          getProjection(tag),
          {
            $sort: {
              weight: -1,
            },
          },
          { $skip: LIST_LENGTH + n },
          { $limit: 1 },
        ],
        { allowDiskUse: true },
      )
      .toArray(),
  );
}

export default async function generateList(tag: TagRecord): Promise<boolean> {
  logger.debug('generateList: start');
  const albums:
    | Weighted<WithId<AlbumRecord>>[]
    | undefined = await mongodb.albums
    .aggregate<Weighted<WithId<AlbumRecord>>>(
      [
        {
          $match: {
            [`tags.${tag.name}`]: {
              $gt: MIN_TAG_COUNT,
            },
            hidden: {
              $ne: true,
            },
          },
        },
        getProjection(tag),
        {
          $sort: {
            weight: -1,
          },
        },
        { $limit: LIST_LENGTH },
      ],
      { allowDiskUse: true },
    )
    .toArray();
  if (size(albums) < LIST_LENGTH) {
    logger.warn(`${size(albums)}, but required at least ${LIST_LENGTH}`);
    await saveList(tag);
  } else {
    let skipCounter = 0;
    const albumsWithDates = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const album of albums) {
      // eslint-disable-next-line no-await-in-loop
      let albumWithDate = await populateAlbumDate(album);
      while (!albumWithDate) {
        // eslint-disable-next-line no-await-in-loop
        const extraAlbum = (await acquireExtraAlbum(tag, skipCounter)) || null;
        if (!extraAlbum) {
          logger.warn(`Failed to find sufficient number of albums`);
          // eslint-disable-next-line no-await-in-loop
          await saveList(tag);
          logger.debug('generateList: success');
          return false;
        }
        // eslint-disable-next-line no-await-in-loop
        albumWithDate = await populateAlbumDate(extraAlbum);
        skipCounter += 1;
      }
      if (!albumWithDate.numberOfTracks) {
        logger.warn(
          `${albumWithDate.artist} - ${albumWithDate.name}: NUMBER OF TRACKS UNKNOWN`,
        );
      }
      albumsWithDates.push(albumWithDate);
    }
    await saveList(
      tag,
      await populateAlbumsCovers(sortBy(albumsWithDates, ['date'])),
    );
  }
  logger.debug('generateList: success');

  return size(albums) >= LIST_LENGTH;
}
