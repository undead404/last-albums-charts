import * as autocompleteJs from '@algolia/autocomplete-js';
import type { AutocompleteComponents } from '@algolia/autocomplete-js/dist/esm/types/AutocompleteComponents';
import { connectAutoComplete } from 'react-instantsearch-dom';

import searchClient from '../services/algolia';
import type { TagPayload } from '../types';

import SearchAutocomplete from './search-autocomplete';
import SearchTagItem from './search-tag-item';

function Search() {
  return (
    <SearchAutocomplete
      openOnFocus={true}
      getSources={({ query }) => [
        {
          sourceId: 'tags',
          getItems() {
            return autocompleteJs.getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: 'tags',
                  query,
                },
              ],
            });
          },
          templates: {
            item({
              item,
              components,
            }: {
              components: AutocompleteComponents;
              item: TagPayload;
            }) {
              return <SearchTagItem hit={item} components={components} />;
            },
          },
        },
      ]}
    />
  );
}

export default connectAutoComplete(Search);
