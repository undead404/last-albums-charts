import assure from '../assure';
import logger from '../logger';

import acquire from './acquire';
import { AlbumGetInfoPayload, AlbumInfo } from './api-types';

export default async function getAlbumInfo(
  albumName: string,
  artistName: string,
): Promise<AlbumInfo | undefined> {
  logger.debug(`album.getInfo(${albumName}, ${artistName})`);
  assure('album.getInfo', { albumName, artistName });
  const data = await acquire<AlbumGetInfoPayload>({
    album: albumName,
    artist: artistName,
    method: 'album.getInfo',
  });

  return data?.album;
}
