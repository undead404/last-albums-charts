import compact from 'lodash/compact';
import find from 'lodash/find';
import map from 'lodash/map';
import lunr from 'lunr';
import { useMemo } from 'react';
import { useRouteData } from 'react-static';

import { TagForTagsPage } from '../../types';

export default function useFilteredTags(
  tags: TagForTagsPage[],
  searchTerm?: string,
): TagForTagsPage[] {
  const { searchIndex } = useRouteData();
  const search: lunr.Index | null = useMemo(
    () => (searchIndex ? lunr.Index.load(searchIndex) : null),
    [searchIndex],
  );
  return useMemo(() => {
    if (!search || !searchTerm) {
      return tags;
    }
    const results = search.search(searchTerm);
    return compact(map(results, (result) => find(tags, ['name', result.ref])));
  }, [searchTerm, tags]);
}
