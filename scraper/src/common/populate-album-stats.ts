import SQL from '@nearform/sql';
import { isAfter, sub } from 'date-fns';
import _ from 'lodash';

import { findAlbum } from './database/album.js';
import database from './database/index.js';
import type { AlbumInfo } from './lastfm/api-types.js';
import getAlbumInfo from './lastfm/get-album-info.js';
import logger from './logger.js';
import maybeMisspelled from './maybe-misspelled.js';
import type { Album } from './types.js';

const { compact, isNil, map, reject, size, sumBy, toNumber } = _;

const MIN_TRACK_LENGTH = 30;

function getSmallImage(albumInfo: AlbumInfo) {
  return albumInfo.image.find((image) => image.size === 'small')?.['#text'];
}

function getLargeImage(albumInfo: AlbumInfo) {
  return (albumInfo.image.findLast((image) => image.size === 'mega') ||
    albumInfo.image.findLast((image) => image.size === 'extralarge') ||
    albumInfo.image.findLast((image) => image.size === 'large'))?.['#text'];
}

export default async function populateAlbumStats(
  album: Album,
  isNew = false,
): Promise<void> {
  const originalAlbum =
    (await findAlbum({
      artist: album.artist,
      name: album.name,
    })) || (isNew ? album : null);

  if (!originalAlbum) {
    logger.warn(
      `${album.artist} - ${album.name}: album already erased from db`,
    );
    return;
  }
  if (
    originalAlbum.statsUpdatedAt &&
    isAfter(originalAlbum.statsUpdatedAt, sub(new Date(), { months: 1 }))
  ) {
    return;
  }

  const albumInfo = await getAlbumInfo(album.name, album.artist);
  logger.debug(`populateAlbumStats: ${album.artist} - ${album.name}`);
  if (!albumInfo) {
    return;
  }
  if (await maybeMisspelled(album, albumInfo)) {
    return;
  }

  const albumUpdate: Partial<Album> = {
    // artist: albumInfo.artist,
    cover: getLargeImage(albumInfo),
    duration:
      sumBy(albumInfo.tracks?.track, (track) => toNumber(track?.duration)) ||
      null,
    listeners: toNumber(albumInfo.listeners),
    // name: albumInfo.name,
    playcount: toNumber(albumInfo.playcount),
    thumbnail: getSmallImage(albumInfo),
  };

  if (!originalAlbum.numberOfTracks) {
    albumUpdate.numberOfTracks =
      size(
        reject(
          albumInfo.tracks?.track,
          (track) =>
            track?.duration && toNumber(track?.duration) < MIN_TRACK_LENGTH,
        ),
      ) || null;
  }

  const query = SQL`
    UPDATE "Album"
    SET ${SQL.glue(
      compact(
        map(albumUpdate, (value, key) => {
          if (isNil(value)) {
            return null;
          }
          switch (key) {
            case 'duration': {
              return SQL`"duration" = ${value}`;
            }
            case 'listeners': {
              return SQL`"listeners" = ${value}`;
            }
            case 'numberOfTracks': {
              return SQL`"numberOfTracks" = ${value}`;
            }
            case 'playcount': {
              return SQL`"playcount" = ${value}`;
            }
            default: {
              return null;
            }
          }
        }),
      ),
      ', ',
    )},
    "statsUpdatedAt" = NOW()
    WHERE "artist" = ${album.artist} AND
      "name" = ${album.name}
  `;

  await database.query(query);
}
