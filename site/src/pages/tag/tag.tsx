import { LastDotFm } from '@icons-pack/react-simple-icons';
import {
  Alert,
  BackTop,
  Descriptions,
  DescriptionsProps,
  Layout,
  PageHeader,
  PageHeaderProps,
  Typography,
} from 'antd';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import reject from 'lodash/reject';
import sortBy from 'lodash/sortBy';
import React, { useEffect, useMemo } from 'react';
import { useRouteData } from 'react-static';
import { CSSProperties } from 'styled-components';

import { SerializedTag } from '../../../types';
import AlbumsTable from '../../components/AlbumsTable/AlbumsTable';
import IconLink from '../../components/IconLink';
import TagHelmet from '../../components/TagHelmet';
import getAlbumTitle from '../../utils/get-album-title';
import goBack from '../../utils/go-back';

const LASTFM_ICON = <LastDotFm color="#D51007" />;
const LAYOUT_HEADER_STYLE: CSSProperties = {
  height: 'auto',
  padding: '0px',
};
const DESCRIPTIONS_COLUMN: DescriptionsProps['column'] = {
  xxl: 4,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

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
  const avatar: PageHeaderProps['avatar'] = useMemo(() => {
    const imageSource = find(
      sortBy(tag.topAlbums, (album) => -album.weight),
      'cover',
    )?.cover;
    if (!imageSource) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return {
      src: imageSource,
    };
  }, [tag.topAlbums]);
  useEffect(() => {
    forEach(tag?.topAlbums, (album) => {
      if (!album.numberOfTracks) {
        // eslint-disable-next-line no-console
        console.warn(getAlbumTitle(album), 'number of tracks unknown');
      } else {
        // eslint-disable-next-line no-console
        console.debug(
          getAlbumTitle(album),
          'number of tracks',
          album.numberOfTracks,
        );
      }
    });
  }, [tag]);
  if (!tag) {
    return null;
  }
  return (
    <Layout>
      <TagHelmet tag={tag} />
      <Layout.Header style={LAYOUT_HEADER_STYLE}>
        <PageHeader
          avatar={avatar}
          extra={iconLink}
          ghost={false}
          onBack={goBack}
          title={tag.name}
        >
          <Descriptions column={DESCRIPTIONS_COLUMN} size="small">
            <Descriptions.Item label="Albums scraped">
              <Typography.Text>{tag.albumsScrapedAt}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Last updated">
              <Typography.Text>{tag.listUpdatedAt}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </Layout.Header>
      <Layout.Content>
        {process.env.NODE_ENV !== 'production' &&
          map(reject(tag.topAlbums, 'numberOfTracks'), (album) => {
            const title = getAlbumTitle(album);
            return (
              <Alert
                key={title}
                message={`${title} has numberOfTracks empty`}
                type="warning"
              />
            );
          })}
        <AlbumsTable albums={tag.topAlbums || undefined} />
      </Layout.Content>
      <BackTop />
    </Layout>
  );
}
