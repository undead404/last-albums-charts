import filter from 'lodash/filter';
import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import { useMemo } from 'react';

import { TagForTagsPage } from '../../types';

export default function useFilteredTags(
  tags: TagForTagsPage[],
  searchTerm?: string,
): TagForTagsPage[] {
  return useMemo(() => {
    if (!searchTerm) {
      return tags;
    }
    return filter(tags, (tag) => includes(tag.name, toLower(searchTerm)));
  }, [searchTerm, tags]);
}
