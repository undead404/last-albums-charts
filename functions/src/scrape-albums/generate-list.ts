import size from 'lodash/size';
import { WithId } from 'mongodb';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongodb from '../common/mongo-database';
import populateAlbumsCovers from '../common/populate-albums-covers';
import { AlbumRecord, TagRecord, Weighted } from '../common/types';

import saveList from './save-list';

const AVERAGE_NUMBER_OF_TRACKS = 7;
const AVERAGE_SONG_DURATION = 210;
const AVERAGE_ALBUM_DURATION = AVERAGE_SONG_DURATION * AVERAGE_NUMBER_OF_TRACKS;
const LIST_LENGTH = 100;
const MIN_TAG_COUNT = 0;

const EXTREME_EXP = 3;
const MAX_TAG_COUNT = 100;

export default async function generateList(tag: TagRecord): Promise<boolean> {
  logger.debug('generateList: start');
  const start = new Date();
  try {
    if (!mongodb.isConnected) {
      await mongodb.connect();
    }
    const albums:
      | Weighted<WithId<AlbumRecord>>[]
      | undefined = await mongodb.albums
      .aggregate<Weighted<WithId<AlbumRecord>>>(
        [
          {
            $match: {
              date: {
                $ne: null,
              },
              [`tags.${tag.name}`]: {
                $gt: MIN_TAG_COUNT,
              },
            },
          },
          {
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
          },
          {
            $sort: {
              weight: -1,
            },
          },
          { $limit: LIST_LENGTH },
          {
            $sort: {
              date: 1,
              name: 1,
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
    if (size(albums) < LIST_LENGTH) {
      logger.warn(`${size(albums)}, but required at least ${LIST_LENGTH}`);
      await saveList(tag);
    } else {
      await saveList(tag, await populateAlbumsCovers(albums));
    }
    logger.debug('generateList: success');

    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: tag.name,
      title: 'generateList',
    });
    return size(albums) >= LIST_LENGTH;
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: tag.name,
      title: 'generateList',
    });
    throw error;
  }
}
