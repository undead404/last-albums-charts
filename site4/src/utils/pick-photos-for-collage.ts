import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

import type { TagPayload } from '../types';

const COVERS_NEEDED = 9;

export default function pickPhotosForCollage(tag: TagPayload): string[] {
  const result = map(
    sortBy(
      take(sortBy(filter(tag.list, 'album.cover'), ['place']), COVERS_NEEDED),
      ['album.date'],
    ),
    'album.cover',
  );
  if (result.length < COVERS_NEEDED) {
    return [];
  }
  return result;
}
