import { Link } from '@reach/router';
import { BackTop, Input, Layout, PageHeader, Table, TableProps } from 'antd';
import map from 'lodash/map';
import React, { CSSProperties, useMemo, useState } from 'react';
import { useRouteData } from 'react-static';

import { SerializedTag, Tag } from '../../../types';
import useFilteredTags from '../../hooks/use-filtered-tags';
import deserializeTag from '../../utils/deserialize-tag';
import goBack from '../../utils/go-back';

import COLUMNS from './columns';

const SCROLL: TableProps<Tag>['scroll'] = {
  y: '100vh',
};

const HEADER_STYLE: CSSProperties = { background: 'none' };
const LIST_LINK = <Link to="/tag-list">Full list</Link>;
export default function Tags(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const { tags: serializedTags }: { tags: SerializedTag[] } = useRouteData();
  const tags = useMemo(() => map(serializedTags, deserializeTag), [
    serializedTags,
  ]);
  const filteredTags = useFilteredTags(tags, searchTerm);

  return (
    <Layout>
      <Layout.Header style={HEADER_STYLE}>
        <PageHeader
          extra={LIST_LINK}
          onBack={goBack}
          title="Available charts"
        />
      </Layout.Header>
      <Layout.Content>
        <Input.Search onSearch={setSearchTerm} placeholder="Search..." />
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
