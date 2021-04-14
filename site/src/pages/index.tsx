import {
  Avatar,
  Layout,
  PageHeader,
  Table,
  TableProps,
  Typography,
} from 'antd';
import { formatISO } from 'date-fns';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import { Head, useRouteData } from 'react-static';

import { Album } from '../../types';
import AlbumExpanded from '../components/AlbumExpanded';
import AlbumLinks from '../components/AlbumLinks';
import compareStrings from '../utils/compare-strings';
import getAlbumTitle from '../utils/get-album-title';
import stopPropagation from '../utils/stop-propagation';

function getAlbumKey(album: Album): string {
  return getAlbumTitle(album, false);
}

const COLUMNS: TableProps<Album>['columns'] = [
  {
    dataIndex: 'rating',
    // render(_value, _album, index) {
    //   return `${index + 1}`;
    // },
    sorter(album1, album2) {
      if (album1.rating < album2.rating) {
        return -1;
      }
      if (album1.rating > album2.rating) {
        return 1;
      }
      return 0;
    },
    title: '#',
  },
  {
    key: 'title',
    render(_value, album) {
      return (
        <Typography.Text copyable onClick={stopPropagation}>
          {getAlbumTitle(album, false)}
        </Typography.Text>
      );
    },
    title: 'Name',
  },
  {
    dataIndex: 'date',
    defaultSortOrder: 'ascend',
    sorter(album1, album2) {
      return compareStrings(album1.date || '', album2.date || '');
    },
    title: 'Released at',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value, album) {
      return (
        <Avatar src={album.thumbnail || 'https://via.placeholder.com/150'} />
      );
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    // responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'links',
    render(_value, album) {
      return <AlbumLinks album={album} />;
    },
    responsive: ['lg', 'xl', 'xxl'],
    title: 'Links',
  },
];
interface IndexRouteData {
  topList: Album[];
}

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
  const expandable = useMemo<TableProps<Album>['expandable']>(
    () => ({
      expandedRowRender(album: Album) {
        return <AlbumExpanded album={album} tagName="Overall" />;
      },
      expandRowByClick: true,
    }),
    [],
  );
  return (
    <Layout>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <title>{title}</title>
        <meta content={title} name="title" />
        <meta
          content="10 albums you must hear before you die"
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
          subTitle="10 albums to hear before you die"
          title="You Must Hear"
        />
      </Layout.Header>
      <Layout.Content>
        <Table
          columns={COLUMNS}
          dataSource={topList || undefined}
          expandable={expandable}
          loading={!topList}
          pagination={false}
          rowKey={getAlbumKey}
        />
      </Layout.Content>
    </Layout>
  );
}
