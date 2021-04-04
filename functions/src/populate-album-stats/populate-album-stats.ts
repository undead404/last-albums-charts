import sumBy from 'lodash/sumBy';
import size from 'lodash/size';
import toNumber from 'lodash/toNumber';

import getAlbumInfo from '../common/lastfm/get-album-info';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload, AlbumRecord } from '../common/types';
import logger from '../common/logger';

export default async function populateAlbumStats(
  album: AlbumAmqpPayload,
): Promise<void> {
  logger.info(`populateAlbumStats: ${album.artist} - ${album.name}`);
  const albumInfo = await getAlbumInfo(album.name, album.artist);
  if (albumInfo) {
    const albumUpdate: Partial<AlbumRecord> = {
      duration:
        sumBy(albumInfo.tracks.track, (track) => toNumber(track.duration)) ||
        null,
      listeners: toNumber(albumInfo.listeners),
      numberOfTracks: size(albumInfo.tracks.track) || null,
      playcount: toNumber(albumInfo.playcount),
    };
    await mongoDatabase.albums.updateOne(
      { artist: album.artist, name: album.name },
      { $set: albumUpdate },
    );
  }
}
