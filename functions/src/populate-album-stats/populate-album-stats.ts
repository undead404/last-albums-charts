import size from 'lodash/size';
import sumBy from 'lodash/sumBy';
import toNumber from 'lodash/toNumber';

import getAlbumInfo from '../common/lastfm/get-album-info';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload, AlbumRecord } from '../common/types';

export default async function populateAlbumStats(
  album: AlbumAmqpPayload,
): Promise<void> {
  logger.info(`populateAlbumStats: ${album.artist} - ${album.name}`);
  const albumInfo = await getAlbumInfo(album.name, album.artist);
  if (albumInfo) {
    if (albumInfo.artist !== album.artist || albumInfo.name !== album.name) {
      const originalAlbum = await mongoDatabase.albums.findOne({
        artist: albumInfo.artist,
        name: albumInfo.name,
      });
      if (originalAlbum) {
        logger.warn(
          `${album.artist}'s "${album.name}" is a duplicate of ${albumInfo.artist}'s "${albumInfo.name}"`,
        );
        await mongoDatabase.albums.deleteOne({
          artist: album.artist,
          name: album.name,
        });
        return;
      }
    }
    const albumUpdate: Partial<AlbumRecord> = {
      artist: albumInfo.artist,
      duration:
        sumBy(albumInfo.tracks?.track, (track) => toNumber(track.duration)) ||
        null,
      listeners: toNumber(albumInfo.listeners),
      name: albumInfo.name,
      numberOfTracks: size(albumInfo.tracks?.track) || null,
      playcount: toNumber(albumInfo.playcount),
    };
    await mongoDatabase.albums.updateOne(
      { artist: album.artist, name: album.name },
      { $set: albumUpdate },
    );
  }
}
