import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import type { TagPayload } from '../types';

export default function getTagPreview(tag: TagPayload): string {
  return (
    find(sortBy(tag.list, 'place'), 'album.cover')?.album?.cover ||
    'https://via.placeholder.com/450'
  );
}
