import { LastDotFm } from '@icons-pack/react-simple-icons';
import {
  Avatar,
  BackTop,
  Descriptions,
  Layout,
  PageHeader,
  Table,
  TableProps,
  Typography,
} from 'antd';
import React, { MouseEvent, useMemo } from 'react';
import { useRouteData } from 'react-static';

import { Album, SerializedTag, Weighted } from '../../types';

import AlbumExpanded from '../components/AlbumExpanded';
import AlbumLinks from '../components/AlbumLinks';
import IconLink from '../components/IconLink';
import TagHelmet from '../components/TagHelmet';
import compareStrings from '../utils/compare-strings';
import getAlbumTitle from '../utils/get-album-title';
import goBack from '../utils/go-back';

function getAlbumKey(album: Album): string {
  return getAlbumTitle(album, false);
}

function stopPropagation(event: MouseEvent): void {
  event.stopPropagation();
}

const COLUMNS: TableProps<Weighted<Album>>['columns'] = [
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
      return compareStrings(album1.date, album2.date);
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

export default function TagPage(): JSX.Element {
  const {
    availableTags,
    tag,
  }: { availableTags: string[]; tag: SerializedTag } = useRouteData();
  const expandable = useMemo<TableProps<Album>['expandable']>(
    () => ({
      expandedRowRender(album: Album) {
        return (
          <AlbumExpanded
            album={album}
            availableTags={availableTags}
            tagName={tag.name}
          />
        );
      },
      expandRowByClick: true,
    }),
    [availableTags, tag.name],
  );
  return (
    <Layout>
      <TagHelmet tag={tag} />
      <Layout.Header>
        <PageHeader
          extra={
            <IconLink
              icon={<LastDotFm color="#D51007" />}
              url={`https://last.fm/tag/${encodeURIComponent(tag.name)}`}
            />
          }
          ghost={false}
          onBack={goBack}
          subTitle="100 albums to hear before you die"
          title={tag.name}
        >
          <Descriptions column={3} size="small">
            <Descriptions.Item label="Albums scraped at">
              {tag.lastProcessedAt}
            </Descriptions.Item>
            <Descriptions.Item label="List created at">
              {tag.listCreatedAt}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </Layout.Header>
      <Layout.Content>
        <Table
          columns={COLUMNS}
          dataSource={tag.topAlbums}
          expandable={expandable}
          pagination={false}
          rowKey={getAlbumKey}
        />
      </Layout.Content>
      <BackTop />
    </Layout>
  );
}
