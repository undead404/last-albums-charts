import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import { SerializedTag } from '../../types';

export default function getTagPreview(tag: SerializedTag): string {
  return (
    find(
      sortBy(tag.topAlbums, (album) => -album.weight),
      'cover',
    )?.cover || 'https://via.placeholder.com/450'
  );
}
