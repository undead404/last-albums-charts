import { LastDotFm } from '@icons-pack/react-simple-icons';
import { BackTop, Descriptions, Layout, PageHeader } from 'antd';
import React, { useMemo } from 'react';
import { useRouteData } from 'react-static';

import { SerializedTag } from '../../../types';
import AlbumsTable from '../../components/AlbumsTable/AlbumsTable';
import IconLink from '../../components/IconLink';
import TagHelmet from '../../components/TagHelmet';
import goBack from '../../utils/go-back';

const LASTFM_ICON = <LastDotFm color="#D51007" />;

export default function TagPage(): JSX.Element | null {
  const {
    tag,
  }: { availableTags: string[]; tag: SerializedTag } = useRouteData();
  const iconLink = useMemo(
    () =>
      tag ? (
        <IconLink
          icon={LASTFM_ICON}
          url={`https://last.fm/tag/${encodeURIComponent(tag.name)}`}
        />
      ) : null,
    [tag],
  );
  if (!tag) {
    return null;
  }
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
        <AlbumsTable albums={tag.topAlbums || undefined} />
      </Layout.Content>
      <BackTop />
    </Layout>
  );
}
