import SQL from '@nearform/sql';
import differenceBy from 'lodash/differenceBy';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import nth from 'lodash/nth';
import pick from 'lodash/pick';
import size from 'lodash/size';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

import { findAlbumTagWithAlbum } from './database/album-tag';
import { getList } from './database/tag-list-item';
import populateAlbumDate from './populate-album-date/populate-album-date';
import database from './database';
import logger from './logger';
// import maybeMisspelled from './maybe-misspelled';
import populateAlbumsCovers from './populate-albums-covers';
import Progress from './progress';
import saveList from './save-list';
import { Album, AlbumTag, Tag, TagListItem, Weighted } from './types';

const LIST_LENGTH = 100;
const TAKE_MODIFIER = 2;
const MIN_TAG_COUNT = 0;

function getAlbumTitle(album: Album): string {
  return `${album.artist} - ${album.name} (${album.date})`;
}
function didAlbumsChange(
  oldAlbums: (TagListItem & { album: Album })[],
  albums: Album[],
): boolean {
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
  return some(
    map(oldAlbums, 'album'),
    (oldAlbum, index) =>
      getAlbumTitle(oldAlbum) !== getAlbumTitle(albums[index]),
  );
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
    await (didAlbumsChange(oldAlbums, albums)
      ? saveList(tag, await populateAlbumsCovers(albums))
      : saveList(tag));
  }
  logger.debug('generateList: success');

  return size(albumTags) >= LIST_LENGTH;
}
