import compact from 'lodash/compact';
import find from 'lodash/find';
import map from 'lodash/map';
import lunr from 'lunr';
import { useMemo } from 'react';

import { Tag } from '../../types';

import searchIndex from '../search-index.json';

const search = lunr.Index.load(searchIndex);

export default function useFilteredTags(
  tags: Tag[],
  searchTerm?: string,
): Tag[] {
  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return tags;
    }
    const results = search.search(searchTerm);
    console.info(results);
    return compact(map(results, (result) => find(tags, ['name', result.ref])));
  }, [searchTerm, tags]);
  return filteredItems;
}
