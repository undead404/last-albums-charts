import filenamify from 'filenamify';
import React from 'react';
import { Head } from 'react-static';

import { SerializedTag } from '../../types';
import getTagPreview from '../utils/get-tag-preview';

export interface TagHelmetProperties {
  tag: SerializedTag;
}

export default function TagHelmet({ tag }: TagHelmetProperties): JSX.Element {
  const title = `You Must Hear | ${tag.name}`;
  const image = getTagPreview(tag);
  const url = `https://you-must-hear.surge.sh/tag/${filenamify(tag.name)}`;
  return (
    <Head>
      {/* <!-- Primary Meta Tags --> */}
      <title>You Must Hear | {tag.name}</title>
      <meta content={title} name="title" />
      <meta
        content="100 albums you must hear before you die"
        name="description"
      />

      {/* <!-- Open Graph / Facebook --> */}
      <meta content="website" property="og:type" />
      <meta content={url} property="og:url" />
      <meta content={title} property="og:title" />
      <meta
        content="100 albums you must hear before you die"
        property="og:description"
      />
      <meta content={image} property="og:image" />

      {/* <!-- Twitter --> */}
      <meta content="summary_large_image" property="twitter:card" />
      <meta content={url} property="twitter:url" />
      <meta content={title} property="twitter:title" />
      <meta
        content="100 albums you must hear before you die"
        property="twitter:description"
      />
      <meta content={image} property="twitter:image"></meta>

      <meta content={tag.lastProcessedAt} httpEquiv="date" />
      <meta content={tag.listCreatedAt} httpEquiv="last-modified" />
    </Head>
  );
}
