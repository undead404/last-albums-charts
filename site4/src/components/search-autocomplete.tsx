import * as autocompleteJs from '@algolia/autocomplete-js';
import type { AutocompleteOptions } from '@algolia/autocomplete-js/dist/esm/types/AutocompleteOptions';
import noop from 'lodash/noop';
import {
  type MutableRefObject,
  createElement,
  Fragment,
  useEffect,
  useRef,
} from 'react';
import { type Root, createRoot } from 'react-dom/client';

import type { TagPayload } from '../types';

export type SearchAutocompleteProperties = Partial<
  AutocompleteOptions<Record<string, never> & TagPayload>
>;

export default function SearchAutocomplete(
  properties: SearchAutocompleteProperties,
) {
  const containerReference: MutableRefObject<HTMLDivElement | null> =
    useRef(null);
  const panelRootReference: MutableRefObject<null | Root> = useRef(null);
  const rootReference: MutableRefObject<HTMLElement | null> =
    useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerReference.current) {
      return noop;
    }

    const search = autocompleteJs.autocomplete({
      container: containerReference.current,
      renderer: { createElement, Fragment, render: noop },
      render({ children }, root) {
        if (!panelRootReference.current || rootReference.current !== root) {
          rootReference.current = root;

          panelRootReference.current?.unmount();
          panelRootReference.current = createRoot(root);
        }

        panelRootReference.current.render(children);
      },
      ...properties,
    });

    return () => {
      search.destroy();
    };
  }, [properties]);

  return <div className="autocomplete-wrapper" ref={containerReference} />;
}
