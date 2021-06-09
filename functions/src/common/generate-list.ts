import { Album, AlbumTag, Tag, TagListItem } from '.prisma/client';
import map from 'lodash/map';
import nth from 'lodash/nth';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

import populateAlbumDate from './populate-album-date/populate-album-date';
import logger from './logger';
import populateAlbumsCovers from './populate-albums-covers';
import prisma from './prisma';
import saveList from './save-list';

const LIST_LENGTH = 100;
const TAKE_MODIFIER = 2;
const MIN_TAG_COUNT = 0;

async function getCorrectedAlbumTag(
  albumTag: AlbumTag & { album: Album },
  // knownAlbumTags: (AlbumTag & { album: Album })[],
): Promise<(AlbumTag & { album: Album }) | null> {
  await populateAlbumDate(albumTag.album);
  // eslint-disable-next-line no-await-in-loop
  const correctedAlbumTag = await prisma.albumTag.findUnique({
    include: {
      album: true,
    },
    where: {
      albumArtist_albumName_tagName: {
        albumArtist: albumTag.albumArtist,
        albumName: albumTag.albumName,
        tagName: albumTag.tagName,
      },
    },
  });
  if (
    correctedAlbumTag &&
    !correctedAlbumTag.album?.date
    // find(knownAlbumTags, {
    //   'album.artist': correctedAlbumTag.albumArtist,
    //   'album.name': correctedAlbumTag.albumName,
    // }))
  ) {
    logger.warn(
      `${correctedAlbumTag.albumArtist} - ${correctedAlbumTag.albumName}: date unavailable`,
    );
    return null;
  }
  return correctedAlbumTag;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function generateList(
  tag: Tag & { list: (TagListItem & { album: Album })[] },
): Promise<boolean> {
  logger.debug('generateList: start');
  const availableAlbumTags = await prisma.albumTag.findMany({
    include: {
      album: true,
    },
    orderBy: [
      {
        weight: 'desc',
      },
    ],
    take: LIST_LENGTH * TAKE_MODIFIER,
    where: {
      album: { hidden: false },
      count: {
        gt: MIN_TAG_COUNT,
      },
      tagName: tag.name,
    },
  });
  const albumTags = take(availableAlbumTags, LIST_LENGTH);
  if (size(albumTags) < LIST_LENGTH) {
    logger.warn(`${size(albumTags)}, but required at least ${LIST_LENGTH}`);
    await saveList(tag);
  } else {
    let skipCounter = 0;
    const albumTagsWithDates: (AlbumTag & { album: Album })[] = [];
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
          `${correctedAlbumTag.album.artist} - ${correctedAlbumTag.album.name}: NUMBER OF TRACKS UNKNOWN`,
        );
      }
      albumTagsWithDates.push(correctedAlbumTag);
    }
    await saveList(
      tag,
      await populateAlbumsCovers(
        map(
          sortBy(albumTagsWithDates, (albumTag) => -albumTag.weight),
          'album',
        ),
      ),
    );
  }
  logger.debug('generateList: success');

  return size(albumTags) >= LIST_LENGTH;
}
