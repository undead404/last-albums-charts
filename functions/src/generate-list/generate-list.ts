import size from 'lodash/size';
import { WithId } from 'mongodb';
import { publish } from '../common/amqp-broker';

import isTagBlacklisted from '../common/is-tag-blacklisted';
import logger from '../common/logger';
import mongodb from '../common/mongo-database';
import sleep from '../common/sleep';
import { AlbumRecord, TagRecord, Weighted } from '../common/types';
import generatePost from './generate-post';

import pickTag from './pick-tag';
import saveList from './save-list';

const AVERAGE_NUMBER_OF_TRACKS = 7;
const AVERAGE_SONG_DURATION = 210;
const AVERAGE_ALBUM_DURATION = AVERAGE_SONG_DURATION * AVERAGE_NUMBER_OF_TRACKS;
const DELAY = 5000;
const LIST_LENGTH = 100;

export default async function generateList(): Promise<void> {
  logger.debug('generateList: start');
  const start = new Date();
  let tagRecord: TagRecord | undefined;
  try {
    if (!mongodb.isConnected) {
      await mongodb.connect();
    }
    tagRecord = await pickTag();
    if (!tagRecord) {
      logger.warn('Failed to find sufficient tag');
      return;
    }
    if (isTagBlacklisted(tagRecord.name)) {
      await mongodb.tags.deleteOne({ name: tagRecord.name });
      await generateList();
      return;
    }
    let albums:
      | Weighted<WithId<AlbumRecord>>[]
      | undefined = await mongodb.albums
      .aggregate<Weighted<WithId<AlbumRecord>>>([
        {
          $match: {
            date: {
              $ne: null,
            },
            [`tags.${tagRecord.name}`]: {
              $gt: 0,
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
                `$tags.${tagRecord.name}`,
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
    if (size(albums) < LIST_LENGTH) {
      logger.warn(`${size(albums)}, but required at least ${LIST_LENGTH}`);
      albums = undefined;
    }
    await saveList(tagRecord, albums);
    if (!albums) {
      await sleep(DELAY);
      await generateList();
    } else {
      await generatePost(tagRecord, albums);
    }
    logger.debug('generateList: success');

    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: tagRecord?.name,
      title: 'generateList',
    });
  } catch (error) {
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: tagRecord?.name,
      title: 'generateList',
    });
    throw error;
  }
}
