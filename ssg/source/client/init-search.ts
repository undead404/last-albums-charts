import lunr from 'lunr';

import searchIndex from './search-index.json';

export default function initSearch(): void {
  // eslint-disable-next-line dot-notation
  window['search'] = lunr.Index.load(searchIndex);
}
