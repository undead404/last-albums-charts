import sumBy from 'lodash/sumBy';
import size from 'lodash/size';
import toNumber from 'lodash/toNumber';

import getAlbumInfo from '../common/lastfm/get-album-info';
import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, SerializableAlbum } from '../common/types';
import logger from '../common/logger';

export type PopulateAlbumStatsPayload = Pick<
  SerializableAlbum,
  'artist' | 'name'
>;

export default async function populateAlbumStats(
  album: PopulateAlbumStatsPayload,
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
