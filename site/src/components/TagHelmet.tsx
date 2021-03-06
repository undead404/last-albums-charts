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
  const url = `https://undead404.neocities.org/tag/${filenamify(tag.name)}`;
  return (
    <Head>
      {/* <!-- Primary Meta Tags --> */}
      <title>{title}</title>
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
      <meta content={image} property="twitter:image" />

      {tag.albumsScrapedAt && (
        <meta content={tag.albumsScrapedAt} httpEquiv="date" />
      )}
      {tag.listUpdatedAt && (
        <meta content={tag.listUpdatedAt} httpEquiv="last-modified" />
      )}
    </Head>
  );
}
