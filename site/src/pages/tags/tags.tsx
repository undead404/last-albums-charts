import { Link } from '@reach/router';
import { BackTop, Input, Layout, PageHeader, Table, TableProps } from 'antd';
import map from 'lodash/map';
import React, { useMemo, useState } from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';

import { SerializedTagForTagsPage, TagForTagsPage } from '../../../types';
import useFilteredTags from '../../hooks/use-filtered-tags';
import deserializeTag from '../../utils/deserialize-tag';
import goBack from '../../utils/go-back';

import COLUMNS from './columns';

const SCROLL: TableProps<TagForTagsPage>['scroll'] = {
  y: '100vh',
};

const LayoutHeader = styled(Layout.Header)`
  background: none;
`;

const LIST_LINK = <Link to="/tag-list">Full list</Link>;
export default function Tags(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    tags: serializedTags,
  }: { tags: SerializedTagForTagsPage[] } = useRouteData();
  const tags = useMemo<TagForTagsPage[]>(
    () => map(serializedTags, deserializeTag),
    [serializedTags],
  );
  const filteredTags = useFilteredTags(tags, searchTerm);

  return (
    <Layout>
      <LayoutHeader>
        <PageHeader
          extra={LIST_LINK}
          onBack={goBack}
          title="Available charts"
        />
      </LayoutHeader>
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
