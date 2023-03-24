import assure from '../assure.js';
import logger from '../logger.js';

import acquire from './acquire.js';
import type { AlbumGetInfoPayload, AlbumInfo } from './api-types.js';

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
