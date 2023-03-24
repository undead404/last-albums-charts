import '@algolia/autocomplete-theme-classic';
import { memo } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';

import searchClient from '../services/algolia';

import Search from './search';

function SearchWidget() {
  return (
    <InstantSearch indexName="tags" searchClient={searchClient}>
      <Search />
    </InstantSearch>
  );
}

export default memo(SearchWidget);
