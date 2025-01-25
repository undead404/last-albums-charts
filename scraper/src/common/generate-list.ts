import SQL from '@nearform/sql';
import _ from 'lodash';

import { findAlbumTagWithAlbum } from './database/album-tag.js';
import database from './database/index.js';
import { getList } from './database/tag-list-item.js';
import populateAlbumDate from './populate-album-date/populate-album-date.js';
import { postAlbumToBsky } from './bsky.js';
import createTagCollage from './create-tag-collage.js';
import getAlbumTitle from './get-album-title.js';
import logToTelegram, {
  escapeTelegramMessage,
  logFreshAlbumToTelegram,
} from './log-to-telegram.js';
import logger from './logger.js';
// import maybeMisspelled from './maybe-misspelled.js';
// import populateAlbumsCovers from './populate-albums-covers.js';
import Progress from './progress.js';
import saveList from './save-list.js';
import sequentialAsyncForEach from './sequential-async-for-each.js';
import type { Album, AlbumTag, Tag, TagListItem, Weighted } from './types.js';

const {
  differenceBy,
  every,
  filter,
  find,
  forEach,
  isEmpty,
  map,
  nth,
  pick,
  size,
  some,
  sortBy,
  take,
} = _;

const LIST_LENGTH = 100;
const TAKE_MODIFIER = 2;
const MIN_TAG_COUNT = 0;
const ALBUM_LOG_LIMIT = 10;

// eslint-disable-next-line sonarjs/cognitive-complexity
async function didAlbumsChange(
  oldAlbums: (TagListItem & { album: Album })[],
  albums: Album[],
  tagName: string,
): Promise<boolean> {
  if (isEmpty(albums) && isEmpty(oldAlbums)) {
    logger.debug('Emptiness to emptiness');
    return false;
  }
  if (isEmpty(albums) || isEmpty(oldAlbums)) {
    logger.debug('Remove or create');
    return true;
  }

  const albumsToRemove = differenceBy(
    map(oldAlbums, 'album'),
    albums,
    getAlbumTitle,
  );

  forEach(albumsToRemove, (album) => {
    logger.debug(`REMOVED: ${getAlbumTitle(album)}`);
  });
  const albumsToAdd = differenceBy(
    albums,
    map(oldAlbums, 'album'),
    getAlbumTitle,
  );

  forEach(albumsToAdd, (album) => {
    logger.debug(`ADDED: ${getAlbumTitle(album)}`);
  });

  if (albumsToRemove.length > 0 && albumsToAdd.length > 0) {
    await logToTelegram(
      `\\#tag\\_updates\nПри оновленні тега [${escapeTelegramMessage(
        tagName,
      )}](https://you-must-hear.web.app/tag/${encodeURIComponent(
        tagName,
      )}) – усувається:\n${
        (albumsToRemove.length <= ALBUM_LOG_LIMIT
          ? map(
              albumsToRemove,
              (album) =>
                `\\* ${escapeTelegramMessage(getAlbumTitle(album))} – ${
                  album.numberOfTracks
                } пісень`,
            ).join('\n')
          : 'Понад 10 альбомів') || 'Нічого'
      }\n\nДодається:\n${
        (albumsToAdd.length <= ALBUM_LOG_LIMIT
          ? map(
              albumsToAdd,
              (album) =>
                `\\* ${escapeTelegramMessage(getAlbumTitle(album))} – ${
                  album.numberOfTracks
                } пісень`,
            ).join('\n')
          : 'Понад 10 альбомів') || 'Нічого'
      }
    `,
    );
  }
  const oldAlbumsItems = map(oldAlbums, 'album');
  const appendedAlbums = filter(albums, (newAlbum) =>
    every(oldAlbumsItems, (oldAlbum) => {
      if (!oldAlbum.date) {
        throw new Error(
          `Old album without a release date: ${getAlbumTitle(oldAlbum)}`,
        );
      }
      if (!newAlbum.date) {
        throw new Error(
          `New album without a release date: ${getAlbumTitle(newAlbum)}`,
        );
      }
      return oldAlbum.date < newAlbum.date;
    }),
  );
  const result = some(
    oldAlbumsItems,
    (oldAlbum, index) =>
      getAlbumTitle(oldAlbum) !== getAlbumTitle(albums[index]),
  );
  await sequentialAsyncForEach(appendedAlbums, (album) =>
    logFreshAlbumToTelegram(album, tagName),
  );
  await sequentialAsyncForEach(appendedAlbums, (album) =>
    postAlbumToBsky(album, tagName),
  );
  return result;
}
async function getCorrectedAlbumTag<T extends AlbumTag & { album: Album }>(
  albumTag: T,
  // knownAlbumTags: (AlbumTag & { album: Album })[],
): Promise<T | null> {
  // if (
  //   await maybeMisspelled({
  //     artist: albumTag.albumArtist,
  //     name: albumTag.albumName,
  //   })
  // ) {
  //   logger.warn(`${albumTag.albumArtist} - ${albumTag.albumName}: misspelled`);
  //   return null;
  // }
  await populateAlbumDate(albumTag.album);
  const correctedAlbumTag = await findAlbumTagWithAlbum({
    albumArtist: albumTag.albumArtist,
    albumName: albumTag.albumName,
    tagName: albumTag.tagName,
  });

  if (
    !correctedAlbumTag?.album.date
    // find(knownAlbumTags, {
    //   'album.artist': correctedAlbumTag.albumArtist,
    //   'album.name': correctedAlbumTag.albumName,
    // }))
  ) {
    logger.warn(
      `${correctedAlbumTag?.albumArtist} - ${correctedAlbumTag?.albumName}: date unavailable`,
    );
    return null;
  }

  return correctedAlbumTag ? { ...albumTag, ...correctedAlbumTag } : null;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function generateList(tag: Tag): Promise<boolean> {
  logger.debug('generateList: start');
  const query = SQL`
    SELECT *,
      (COALESCE("Album"."playcount", 0)::FLOAT / COALESCE("Album"."numberOfTracks", (
        SELECT AVG("numberOfTracks") FROM "Album" WHERE "numberOfTracks" IS NOT NULL
      )) *
      COALESCE("Album"."listeners", 0) / COALESCE("Album"."numberOfTracks", (
        SELECT AVG("numberOfTracks") FROM "Album" WHERE "numberOfTracks" IS NOT NULL
      ))) *
      POWER("AlbumTag"."count"::FLOAT / 100, 3)
      AS "weight"
    FROM "AlbumTag"
    JOIN "Album"
    ON "Album"."artist" = "AlbumTag"."albumArtist" AND
      "Album"."name" = "AlbumTag"."albumName"
    WHERE "Album"."hidden" <> true AND
      "AlbumTag"."count" > ${MIN_TAG_COUNT} AND
      "AlbumTag"."tagName" = ${tag.name}
    ORDER BY "weight" DESC
    LIMIT ${LIST_LENGTH * TAKE_MODIFIER}`;

  const result = await database.query<Weighted<AlbumTag & Album>>(query);
  const availableAlbumTags = map(result.rows, (row) => ({
    ...pick(row, ['albumArtist', 'albumName', 'count', 'tagName', 'weight']),
    album: pick(row, [
      'artist',
      'cover',
      'date',
      'duration',
      'hidden',
      'listeners',
      'mbid',
      'name',
      'numberOfTracks',
      'playcount',
      'registeredAt',
      'thumbnail',
    ]),
  }));

  const albumTags = take(availableAlbumTags, LIST_LENGTH);

  if (size(albumTags) < LIST_LENGTH) {
    logger.debug(`${size(albumTags)}, but required at least ${LIST_LENGTH}`);
    await saveList(tag, []);
  } else {
    const progress = new Progress(
      albumTags.length,
      0,
      `correct AlbumTags for ${tag.name}`,
      logger,
    );

    let skipCounter = 0;
    const albumTagsWithDates: Weighted<AlbumTag & { album: Album }>[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const albumTag of albumTags) {
      // eslint-disable-next-line no-await-in-loop
      let correctedAlbumTag = await getCorrectedAlbumTag(
        albumTag,
        // albumTagsWithDates,
      );

      if (!correctedAlbumTag) {
        logger.warn(
          `${albumTag.albumArtist} - ${albumTag.albumName}: date unavailable`,
        );
      }
      while (!correctedAlbumTag) {
        const extraAlbumTag = nth(
          availableAlbumTags,
          LIST_LENGTH + skipCounter,
        );

        skipCounter += 1;
        if (!extraAlbumTag) {
          logger.warn(`Failed to find sufficient number of albums`);
          // eslint-disable-next-line no-await-in-loop
          await saveList(tag);
          logger.debug('generateList: success');
          progress.increment();
          return false;
        }
        // eslint-disable-next-line no-await-in-loop
        correctedAlbumTag = await getCorrectedAlbumTag(
          extraAlbumTag,
          // albumTagsWithDates,
        );
        if (!correctedAlbumTag) {
          logger.warn(
            `${extraAlbumTag.albumArtist} - ${extraAlbumTag.albumName}: date unavailable`,
          );
        }
      }
      if (!correctedAlbumTag.album.numberOfTracks) {
        logger.warn(
          `${correctedAlbumTag.albumArtist} - ${correctedAlbumTag.albumName}: NUMBER OF TRACKS UNKNOWN`,
        );
      }
      albumTagsWithDates.push(correctedAlbumTag);
      progress.increment();
    }

    const albums = map(
      sortBy(albumTagsWithDates, (albumTag) => -albumTag.weight),
      'album',
    );

    const oldAlbums = await getList(tag.name);
    if (await didAlbumsChange(oldAlbums, albums, tag.name)) {
      // const albumsWithCovers = await populateAlbumsCovers(albums);
      const albumsWithCovers = albums;

      await saveList(tag, albumsWithCovers);

      await createTagCollage(
        tag.name,
        map(albumTagsWithDates, (albumTag) => ({
          ...albumTag,
          album:
            find(albumsWithCovers, {
              artist: albumTag.album.artist,
              name: albumTag.album.name,
            }) || albumTag.album,
        })),
      );

      await logToTelegram(
        `\\#create\\_list\nУспішно створено новий список – для тега [${escapeTelegramMessage(
          tag.name,
        )}](https://you-must-hear.web.app/tag/${encodeURIComponent(
          tag.name,
        )}/)`,
      );
    } else {
      await saveList(tag);
    }
  }
  logger.debug('generateList: success');

  return size(albumTags) >= LIST_LENGTH;
}
