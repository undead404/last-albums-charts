import '@algolia/autocomplete-theme-classic';
import { InstantSearch } from 'react-instantsearch-dom';

import searchClient from '../services/algolia';

import Search from './search';

export default function SearchWidget() {
  return (
    <InstantSearch indexName="tags" searchClient={searchClient}>
      <Search />
    </InstantSearch>
  );
}
