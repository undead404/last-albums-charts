import { Link } from '@reach/router';
import { Col, Divider, Layout, PageHeader, Row } from 'antd';
import filenamify from 'filenamify';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import toUpper from 'lodash/toUpper';
import React, { CSSProperties, Fragment, useMemo } from 'react';
import { useRouteData } from 'react-static';

import useLogChanges from '../hooks/use-log-changes';
import goBack from '../utils/go-back';

const LINK_STYLE: CSSProperties = {
  maxWidth: '100%',
  padding: '0.5rem',
};

export interface TagsListRouteData {
  availableTags?: {
    data: string[];
  };
}

export default function TagsList(): JSX.Element {
  const availableTags = useRouteData<TagsListRouteData>().availableTags?.data;
  const groupedTags = useMemo<[string, string[]][]>(
    () =>
      availableTags
        ? sortBy(
            toPairs<string[]>(groupBy<string>(sortBy(availableTags), head)),
            0,
          )
        : [],
    [availableTags],
  );
  useLogChanges('TagsList', 'groupedTags', groupedTags);
  return (
    <Layout>
      <Layout.Header>
        <PageHeader
          extra={<Link to="/tag">As a table</Link>}
          ghost={false}
          onBack={goBack}
          title="Available charts in a list"
        ></PageHeader>
      </Layout.Header>
      <Layout.Content>
        {map(groupedTags, ([firstLetter, tags]) => (
          <Fragment key={firstLetter}>
            <Divider orientation="left">{toUpper(firstLetter)}</Divider>
            <Row gutter={8}>
              {map(tags, (tagName) => (
                <Col key={tagName} span={6} xs={12}>
                  <Link
                    className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-single-line"
                    style={LINK_STYLE}
                    to={`/tag/${filenamify(tagName)}`}
                  >
                    {tagName}
                  </Link>
                </Col>
              ))}
            </Row>
          </Fragment>
        ))}
      </Layout.Content>
    </Layout>
  );
}
