import { WithId } from 'mongodb';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongodb from '../common/mongo-database';
import { AlbumRecord, TagRecord, Weighted } from '../common/types';

import saveList from './save-top-list';

const AVERAGE_NUMBER_OF_TRACKS = 7;
const AVERAGE_SONG_DURATION = 210;
const AVERAGE_ALBUM_DURATION = AVERAGE_SONG_DURATION * AVERAGE_NUMBER_OF_TRACKS;
const LIST_LENGTH = 10;

export default async function generateTopList(): Promise<void> {
  logger.debug('generateTopList: start');
  const start = new Date();
  let tagRecord: TagRecord | undefined;
  try {
    const albums:
      | Weighted<WithId<AlbumRecord>>[]
      | undefined = await mongodb.albums
      .aggregate<Weighted<WithId<AlbumRecord>>>([
        {
          $match: {
            date: {
              $ne: null,
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
                    { $ifNull: ['$numberOfTracks', AVERAGE_NUMBER_OF_TRACKS] },
                  ],
                },
                { $ifNull: ['$listeners', 0] },
                {
                  $divide: [
                    { $ifNull: ['$duration', AVERAGE_ALBUM_DURATION] },
                    { $ifNull: ['$numberOfTracks', AVERAGE_NUMBER_OF_TRACKS] },
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
      ])
      .toArray();
    await saveList(albums);
    logger.debug('generateTopList: success');

    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: tagRecord?.name,
      title: 'generateTopList',
    });
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: tagRecord?.name,
      title: 'generateTopList',
    });
    throw error;
  }
}
