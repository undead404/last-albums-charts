import { Link } from '@reach/router';
import { BackTop, Input, Layout, PageHeader, Table, TableProps } from 'antd';
import { formatISO } from 'date-fns';
import filenamify from 'filenamify';
import map from 'lodash/map';
import React, { CSSProperties, useMemo, useState } from 'react';
import { useRouteData } from 'react-static';

import { SerializedTag, Tag } from '../../types';

import TagImage from '../components/TagImage';
import useFilteredTags from '../hooks/use-filtered-tags';
import useLogChanges from '../hooks/use-log-changes';
import compareDates from '../utils/compare-dates';
import compareStrings from '../utils/compare-strings';
import deserializeTag from '../utils/deserialize-tag';
import goBack from '../utils/go-back';

const COLUMNS: TableProps<Tag>['columns'] = [
  {
    key: 'name',
    render(_value, tag) {
      return <Link to={`/tag/${filenamify(tag.name)}`}>{tag.name}</Link>;
    },
    sorter(tag1, tag2) {
      return compareStrings(tag1.name, tag2.name);
    },
    title: 'Name',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value, tag) {
      return <TagImage tag={tag} />;
    },
    responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'listCreatedAt',
    render(_value, tag) {
      return formatISO(tag.listCreatedAt);
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    sorter(tag1, tag2) {
      return compareDates(tag1.listCreatedAt, tag2.listCreatedAt);
    },
    title: 'List generated at',
  },
  {
    key: 'lastProcessedAt',
    render(_value, tag) {
      return formatISO(tag.lastProcessedAt);
    },
    responsive: ['lg', 'xl', 'xxl'],
    sorter(tag1, tag2) {
      return compareDates(tag1.lastProcessedAt, tag2.lastProcessedAt);
    },
    title: 'Albums scraped at',
  },
  {
    dataIndex: 'power',
    responsive: ['xl', 'xxl'],
    sorter(tag1, tag2) {
      if (tag1.power < tag2.power) {
        return -1;
      }
      if (tag1.power > tag2.power) {
        return 1;
      }
      return 0;
    },
    title: 'Weight',
  },
];

const SCROLL: TableProps<Tag>['scroll'] = {
  y: '100vh',
};

const HEADER_STYLE: CSSProperties = { background: 'none' };

export default function Tags(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const { tags: serializedTags }: { tags: SerializedTag[] } = useRouteData();
  const tags = useMemo(() => map(serializedTags, deserializeTag), [
    serializedTags,
  ]);
  const filteredTags = useFilteredTags(tags, searchTerm);

  useLogChanges('Tags', 'filteredTags', filteredTags);
  return (
    <Layout>
      <Layout.Header style={HEADER_STYLE}>
        <PageHeader
          extra={<Link to="/tag-list">Full list</Link>}
          onBack={goBack}
          title="Available charts"
        ></PageHeader>
      </Layout.Header>
      <Layout.Content>
        <Input.Search
          onSearch={setSearchTerm}
          placeholder="Search..."
        ></Input.Search>
        <Table
          columns={COLUMNS}
          dataSource={filteredTags}
          rowKey="name"
          scroll={SCROLL}
        />
      </Layout.Content>
      <BackTop />
    </Layout>
  );
}
