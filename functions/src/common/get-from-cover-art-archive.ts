import { Album } from '.prisma/client';
import find from 'lodash/find';
import get from 'lodash/get';
import size from 'lodash/size';

import getCoverArtInfo from './cover-art-archive/get-cover-art-info';

export default async function getFromCoverArtArchive(
  albumMbid: string,
): Promise<Pick<Album, 'cover' | 'thumbnail'> | null> {
  const coverArtInfo = await getCoverArtInfo(albumMbid);
  if (!coverArtInfo) {
    return null;
  }
  const frontCoverInfo = find(
    coverArtInfo.images,
    (imageInfo) =>
      size(imageInfo.types) === 1 && imageInfo.types[0] === 'Front',
  );
  if (!frontCoverInfo) {
    return null;
  }
  const thumbnail = get(frontCoverInfo, 'thumbnails.small', null);
  const cover = get(frontCoverInfo, 'thumbnails.large', null);
  if (cover || thumbnail) {
    return {
      cover,
      thumbnail,
    };
  }
  return null;
}
