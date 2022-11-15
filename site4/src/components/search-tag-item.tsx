import type { AutocompleteComponents } from '@algolia/autocomplete-js';

import type { TagPayload } from '../types';

export interface SearchTagItemProperties {
  hit: TagPayload;
  components: AutocompleteComponents;
}

export default function SearchTagItem({
  hit,
  components,
}: SearchTagItemProperties) {
  return (
    <a href={`/tag/${encodeURIComponent(hit.name)}`} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute={['name']} />
        </div>
      </div>
    </a>
  );
}
