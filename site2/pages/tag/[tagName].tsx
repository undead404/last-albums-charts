// eslint-disable-next-line unicorn/filename-case
import { Alert, Descriptions, DescriptionsProps, Typography } from 'antd';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import reject from 'lodash/reject';
import sortBy from 'lodash/sortBy';
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { useContext, useEffect, useMemo } from 'react';

import listTags from '../../common/list-tags';
import openData from '../../common/open-data';
import AlbumsTable from '../../components/AlbumsTable/AlbumsTable';
import Header from '../../components/Header';
import MyLayout from '../../components/MyLayout';
import TagHelmet from '../../components/TagHelmet';
import AvailableTagsContext from '../../contexts/available-tags';
import FirebaseContext from '../../contexts/firebase';
import type { TagPayload } from '../../types';
import getAlbumTitle from '../../utils/get-album-title';

const DESCRIPTIONS_COLUMN: DescriptionsProps['column'] = {
  xxl: 4,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

export interface TagPageProperties {
  availableTags: string[];
  tag: TagPayload;
}

export default function TagPage({
  availableTags,
  tag,
}: TagPageProperties): JSX.Element | null {
  const { logAnalyticsEvent } = useContext(FirebaseContext);
  useEffect(() => {
    logAnalyticsEvent('select_content', { tagName: tag?.name });
  }, [logAnalyticsEvent, tag?.name]);
  const avatar = useMemo(() => {
    const imageSource = find(sortBy(tag?.list, 'place'), 'cover')?.album?.cover;
    if (!imageSource) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return {
      src: imageSource,
    };
  }, [tag?.list]);
  useEffect(() => {
    forEach(tag?.list, (albumPlace) => {
      if (!albumPlace?.album?.numberOfTracks) {
        // eslint-disable-next-line no-console
        console.warn(
          getAlbumTitle(albumPlace?.album),
          'number of tracks unknown',
        );
      } else {
        // eslint-disable-next-line no-console
        console.debug(
          getAlbumTitle(albumPlace?.album),
          'number of tracks',
          albumPlace?.album.numberOfTracks,
        );
      }
    });
  }, [tag]);
  const header = useMemo(
    () =>
      tag ? (
        <Header
          avatar={avatar}
          pageTitle={tag.name}
          renderedAt={tag.listUpdatedAt || undefined}
          url={`https://you-must-hear.firebaseapp.com/tag/${encodeURIComponent(
            tag.name,
          )}`}
        >
          <Descriptions column={DESCRIPTIONS_COLUMN} size="small">
            <Descriptions.Item label="Albums scraped">
              <Typography.Text>{tag?.albumsScrapedAt}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Last updated">
              <Typography.Text>{tag?.listUpdatedAt}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>
          <TagHelmet tag={tag} />
        </Header>
      ) : null,
    [avatar, tag],
  );
  if (!tag) {
    return null;
  }
  return (
    <AvailableTagsContext.Provider value={availableTags}>
      <MyLayout header={header}>
        {process.env.NODE_ENV !== 'production' &&
          map(reject(tag.list, 'album.numberOfTracks'), (albumPlace) => {
            const title = getAlbumTitle(albumPlace?.album);
            return (
              <Alert
                key={title}
                message={`${title} has numberOfTracks empty`}
                type="warning"
              />
            );
          })}
        <AlbumsTable albumPlaces={tag.list} />
      </MyLayout>
    </AvailableTagsContext.Provider>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<TagPageProperties>> {
  return {
    props: {
      availableTags: (await listTags()) || [],
      tag: (await openData(context.params?.tagName as string)) as TagPayload,
    },
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const availableTags = (await listTags()) || [];
  return {
    fallback: true,
    paths: map(availableTags, (tagName) => ({
      params: {
        tagName,
      },
    })),
  };
}
