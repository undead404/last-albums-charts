import { UpdateWriteOpResult } from 'mongodb';

import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumAmqpPayload, AlbumRecord } from '../common/types';

import getFromCoverArtArchive from './get-from-cover-art-archive';
import getFromDiscogs from './get-from-discogs';

function storeEmpty(album: AlbumAmqpPayload): Promise<UpdateWriteOpResult> {
  return mongoDatabase.albums.updateOne(
    { artist: album.artist, name: album.name },
    {
      $set: {
        cover: null,
        thumbnail: null,
      },
    },
  );
}
export default async function populateAlbumCover(
  album: AlbumAmqpPayload,
): Promise<void> {
  logger.info(`populateAlbumCover: ${album.artist} - ${album.name}`);
  let albumUpdate: null | Partial<AlbumRecord> = null;
  if (album.mbid) {
    albumUpdate = await getFromCoverArtArchive(album.mbid);
  }
  if (!albumUpdate) {
    albumUpdate = await getFromDiscogs(album.artist, album.name);
  }
  await (albumUpdate
    ? mongoDatabase.albums.updateOne(
        { mbid: album.mbid },
        { $set: albumUpdate },
      )
    : storeEmpty(album));
}
