import { BackTop, Layout, PageHeader } from 'antd';
import { formatISO } from 'date-fns';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { Head, useRouteData } from 'react-static';

import AlbumsTable from '../../components/AlbumsTable/AlbumsTable';

import IndexRouteData from './index-route-data';

const title = 'You Must Hear';
const url = `https://you-must-hear.surge.sh`;

export default function Index(): JSX.Element {
  const { topList } = useRouteData<IndexRouteData>();
  const image = find(
    sortBy(
      topList,
      (album) => -(album.listeners || 0) * (album.playcount || 0),
    ),
    'cover',
  )?.cover;
  const now = new Date();
  return (
    <Layout>
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
        {image && <meta content={image} property="og:image" />}

        {/* <!-- Twitter --> */}
        <meta content="summary_large_image" property="twitter:card" />
        <meta content={url} property="twitter:url" />
        <meta content={title} property="twitter:title" />
        <meta
          content="100 albums you must hear before you die"
          property="twitter:description"
        />
        {image && <meta content={image} property="twitter:image" />}

        <meta content={formatISO(now)} httpEquiv="date" />
        <meta content={formatISO(now)} httpEquiv="last-modified" />
      </Head>
      <Layout.Header>
        <PageHeader
          ghost={false}
          subTitle="100 albums to hear before you die"
          title="You Must Hear"
        />
      </Layout.Header>
      <Layout.Content>
        <AlbumsTable albums={topList} />
      </Layout.Content>
      <BackTop />
    </Layout>
  );
}
