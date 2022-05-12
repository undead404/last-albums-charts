import formatISO from 'date-fns/formatISO';
import find from 'lodash/find';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import toString from 'lodash/toString';
import type { GetStaticPropsResult } from 'next';
import React, { useMemo } from 'react';

import listTags from '../common/list-tags';
import logger from '../common/logger';
import openData from '../common/open-data';
import AlbumsTable from '../components/AlbumsTable/AlbumsTable';
import Header from '../components/Header';
import MyLayout from '../components/MyLayout';
import AvailableTagsContext from '../contexts/available-tags';
import useLogChanges from '../hooks/use-log-changes';
import type { Album, Weighted } from '../types';

export interface IndexProperties {
  availableTags: string[];
  renderedAt: string;
  topList: Album[];
}

export default function Index({
  availableTags,
  renderedAt,
  topList,
}: IndexProperties): JSX.Element {
  // console.log(availableTags);
  useLogChanges('Index', 'topList', topList);
  const avatar = useMemo(() => {
    const image = find(
      sortBy(
        topList,
        (album) => -(album.listeners || 0) * (album.playcount || 0),
      ),
      'cover',
    )?.cover;
    if (!image) {
      return null;
    }
    return {
      src: image,
    };
  }, [topList]);
  const header = useMemo(
    () => (
      <Header
        avatar={avatar || undefined}
        renderedAt={renderedAt}
        url="https://you-must-hear.firebaseapp.com"
      />
    ),
    [avatar, renderedAt],
  );
  const albumsPlaces = useMemo(
    () =>
      map(orderBy(topList, ['weight'], ['desc']), (album, index) => ({
        album,
        place: index + 1,
      })),
    [topList],
  );
  return (
    <AvailableTagsContext.Provider value={availableTags}>
      <MyLayout header={header}>
        <AlbumsTable albumPlaces={albumsPlaces} />
      </MyLayout>
    </AvailableTagsContext.Provider>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexProperties>
> {
  try {
    return {
      props: {
        availableTags: (await listTags()) || [],
        renderedAt: formatISO(new Date()),
        // availableTags: [],
        // availableTags: [],
        topList: ((await openData('top-list')) as Weighted<Album>[]) || [],
        // topList: [],
      },
    };
  } catch (error: any) {
    logger.error(toString(error));
    throw error;
  }
}
