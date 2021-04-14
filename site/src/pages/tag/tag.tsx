import { LastDotFm } from '@icons-pack/react-simple-icons';
import {
  BackTop,
  Descriptions,
  Layout,
  PageHeader,
  Table,
  TableProps,
} from 'antd';
import React, { useMemo } from 'react';
import { useRouteData } from 'react-static';

import { Album, SerializedTag, Weighted } from '../../../types';
import AlbumExpanded from '../../components/AlbumExpanded';
import IconLink from '../../components/IconLink';
import TagHelmet from '../../components/TagHelmet';
import getAlbumKey from '../../utils/get-album-key';
import goBack from '../../utils/go-back';

import COLUMNS from './columns';

const LASTFM_ICON = <LastDotFm color="#D51007" />;

export default function TagPage(): JSX.Element {
  const {
    tag,
  }: { availableTags: string[]; tag: SerializedTag } = useRouteData();
  const expandable = useMemo<TableProps<Weighted<Album>>['expandable']>(
    () => ({
      expandedRowRender(album: Weighted<Album>) {
        return <AlbumExpanded album={album} tagName={tag.name} />;
      },
      expandRowByClick: true,
    }),
    [tag.name],
  );
  const iconLink = useMemo(
    () => (
      <IconLink
        icon={LASTFM_ICON}
        url={`https://last.fm/tag/${encodeURIComponent(tag.name)}`}
      />
    ),
    [tag.name],
  );
  return (
    <Layout>
      <TagHelmet tag={tag} />
      <Layout.Header>
        <PageHeader
          extra={iconLink}
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
          dataSource={tag.topAlbums || undefined}
          expandable={expandable}
          pagination={false}
          rowKey={getAlbumKey}
        />
      </Layout.Content>
      <BackTop />
    </Layout>
  );
}
