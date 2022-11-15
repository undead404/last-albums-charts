import SQL from '@nearform/sql';
import { isAfter, sub } from 'date-fns';
import compact from 'lodash/compact';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import reject from 'lodash/reject';
import size from 'lodash/size';
import sumBy from 'lodash/sumBy';
import toNumber from 'lodash/toNumber';

import { findAlbum } from './database/album';
import getAlbumInfo from './lastfm/get-album-info';
import database from './database';
import logger from './logger';
import maybeMisspelled from './maybe-misspelled';
import { Album } from './types';

const MIN_TRACK_LENGTH = 30;

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
    duration:
      sumBy(albumInfo.tracks?.track, (track) => toNumber(track?.duration)) ||
      null,
    listeners: toNumber(albumInfo.listeners),
    // name: albumInfo.name,
    playcount: toNumber(albumInfo.playcount),
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
            case 'duration':
              return SQL`"duration" = ${value}`;
            case 'listeners':
              return SQL`"listeners" = ${value}`;
            case 'numberOfTracks':
              return SQL`"numberOfTracks" = ${value}`;
            case 'playcount':
              return SQL`"playcount" = ${value}`;
            default:
              return null;
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
