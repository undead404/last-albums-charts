import { Input, Pagination, Table, TableProps } from 'antd';
import formatISO from 'date-fns/formatISO';
import map from 'lodash/map';
import type { GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import algoliaIndex from '../../common/algolia-index';
import getTagsPagesNumber from '../../common/get-tags-pages-number';
import openData from '../../common/open-data';
import Header from '../../components/Header';
import MyLayout from '../../components/MyLayout';
import TagImage from '../../components/TagImage';
import FirebaseContext from '../../contexts/firebase';
import type { SerializedTagForTagsPage, TagForTagsPage } from '../../types';
import deserializeTag from '../../utils/deserialize-tag';

const COLUMNS: TableProps<TagForTagsPage>['columns'] = [
  {
    key: 'name',
    render(_value: unknown, tag: TagForTagsPage): JSX.Element {
      return (
        <Link href={`/tag/${encodeURIComponent(tag.name)}`}>{tag.name}</Link>
      );
    },
    // sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): -1 | 0 | 1 {
    //   return compareStrings(tag1.name, tag2.name);
    // },
    title: 'Name',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value: unknown, tag: TagForTagsPage): JSX.Element {
      return <TagImage tag={tag} />;
    },
    responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'listUpdatedAt',
    render(_value: unknown, tag: TagForTagsPage): string {
      const when = tag.listUpdatedAt || tag.listCheckedAt;
      if (!when) {
        return 'Never';
      }
      return formatISO(when);
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    // sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): number {
    //   const date1 = tag1.listUpdatedAt || tag1.listCheckedAt;
    //   const date2 = tag2.listUpdatedAt || tag2.listCheckedAt;
    //   return compareDates(date1, date2);
    // },
    title: 'List generated at',
  },
  {
    key: 'albumsScrapedAt',
    render(_value: unknown, tag: TagForTagsPage): string {
      return tag.albumsScrapedAt ? formatISO(tag.albumsScrapedAt) : 'Never';
    },
    responsive: ['lg', 'xl', 'xxl'],
    // sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): number {
    //   return compareDates(tag1.albumsScrapedAt, tag2.albumsScrapedAt);
    // },
    title: 'Albums scraped at',
  },
  {
    key: 'weight',
    render(_value: unknown, tag: TagForTagsPage): string {
      return (tag.weight || 0).toLocaleString('uk-UA');
    },
    responsive: ['xl', 'xxl'],
    // sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): -1 | 0 | 1 {
    //   if ((tag1.weight || 0) < (tag2.weight || 0)) {
    //     return -1;
    //   }
    //   if ((tag1.weight || 0) > (tag2.weight || 0)) {
    //     return 1;
    //   }
    //   return 0;
    // },
    title: 'Power',
  },
];

const SCROLL: TableProps<TagForTagsPage>['scroll'] = {
  y: '100vh',
};

const PAGE_SIZE = 20;

// const LIST_LINK = <Link href="/tag-list">Full list</Link>;

export interface TagsPageProperties {
  initialTags: SerializedTagForTagsPage[];
  numberOfPages: number;
  page: number;
}
export default function TagsPage({
  initialTags,
  numberOfPages,
  page,
}: TagsPageProperties): JSX.Element {
  const router = useRouter();
  const { logAnalyticsEvent } = useContext(FirebaseContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [serializedTags, setSerializedTags] = useState(initialTags);
  const tags = useMemo<TagForTagsPage[]>(
    () => map(serializedTags, deserializeTag),
    [serializedTags],
  );

  useEffect(() => {
    if (!searchTerm) {
      setSerializedTags(initialTags);
      return;
    }
    logAnalyticsEvent('search', { searchTerm });
    algoliaIndex
      .search<SerializedTagForTagsPage>(searchTerm, { page })
      .then((result) => setSerializedTags(result.hits))
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, [initialTags, logAnalyticsEvent, page, searchTerm]);

  const header = useMemo(
    () => (
      <Header
        pageTitle="Tags"
        url={`https://you-must-hear.firebaseapp.com/tags${
          page && page !== 1 ? `/${page}` : ''
        }`}
      />
    ),
    [page],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(`/tags/${newPage}`);
    },
    [router],
  );

  return (
    <MyLayout header={header}>
      <Input.Search onSearch={setSearchTerm} placeholder="Search..." />
      <Table
        columns={COLUMNS}
        dataSource={tags}
        pagination={false}
        rowKey="name"
        scroll={SCROLL}
      />
      {!searchTerm && (
        <Pagination
          current={page}
          onChange={handlePageChange}
          pageSize={PAGE_SIZE}
          showSizeChanger={false}
          total={numberOfPages * PAGE_SIZE}
        />
      )}
    </MyLayout>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<TagsPageProperties>
> {
  return {
    props: {
      initialTags: (await openData(
        'tags-index/tags1',
      )) as SerializedTagForTagsPage[],
      numberOfPages: await getTagsPagesNumber(),
      page: 1,
    },
  };
}
