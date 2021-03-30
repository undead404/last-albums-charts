import find from 'lodash/find';
import get from 'lodash/get';
import size from 'lodash/size';
import { UpdateWriteOpResult } from 'mongodb';

import getCoverArtInfo from '../common/cover-art-archive/get-cover-art-info';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';
import { AlbumRecord, SerializableAlbum } from '../common/types';

export type PopulateAlbumCoverPayload = Pick<
  SerializableAlbum,
  'artist' | 'mbid' | 'name'
>;

function storeEmpty(
  album: PopulateAlbumCoverPayload,
): Promise<UpdateWriteOpResult> {
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
  album: PopulateAlbumCoverPayload,
): Promise<void> {
  logger.info(`populateAlbumCover: ${album.artist} - ${album.name}`);
  if (!album.mbid) {
    await storeEmpty(album);
    return;
  }
  const coverArtInfo = await getCoverArtInfo(album.mbid);
  if (!coverArtInfo) {
    await storeEmpty(album);
    return;
  }
  const frontCoverInfo = find(
    coverArtInfo.images,
    (imageInfo) =>
      size(imageInfo.types) === 1 && imageInfo.types[0] === 'Front',
  );
  if (!frontCoverInfo) {
    await storeEmpty(album);
    return;
  }
  const thumbnail = get(frontCoverInfo, 'thumbnails.small', null);
  const large = get(frontCoverInfo, 'thumbnails.large', null);
  if (!large && !thumbnail) {
    await storeEmpty(album);
    return;
  }
  const albumUpdate: Partial<AlbumRecord> = {
    cover: large,
    thumbnail,
  };
  await mongoDatabase.albums.updateOne(
    { mbid: album.mbid },
    { $set: albumUpdate },
  );
}
