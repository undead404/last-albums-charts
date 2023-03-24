import type { AutocompleteComponents } from '@algolia/autocomplete-js';
import { memo } from 'react';

import type { TagPayload } from '../types';

const numberFormat = new Intl.NumberFormat();
export interface SearchTagItemProperties {
  hit: TagPayload;
  components: AutocompleteComponents;
}

function SearchTagItem({ hit }: SearchTagItemProperties) {
  return (
    <a href={`/tag/${encodeURIComponent(hit.name)}`} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <strong>{hit.name}</strong> (
          <small>
            {numberFormat.format(Number.parseInt(`${hit.weight}`, 10))}
          </small>
          )
        </div>
      </div>
    </a>
  );
}

export default memo(SearchTagItem);
