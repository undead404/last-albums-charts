import { Link } from '@reach/router';
import { Col, Divider, Layout, PageHeader, Row } from 'antd';
import filenamify from 'filenamify';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import toUpper from 'lodash/toUpper';
import React, { Fragment, useMemo } from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';

import goBack from '../utils/go-back';

const TagLink = styled(Link)`
  max-width: 100%;
  padding: 0.5rem;
`;

export interface TagsListRouteData {
  availableTags?: {
    data: string[];
  };
}

const TABLE_LINK = <Link to="/tag">As a table</Link>;

export default function TagsList(): JSX.Element {
  const availableTags = useRouteData<TagsListRouteData>().availableTags?.data;
  const groupedTags = useMemo<[string, string[]][]>(
    () =>
      availableTags
        ? sortBy(
            toPairs<string[]>(
              groupBy<string>(sortBy(availableTags || []), head),
            ),
            0,
          )
        : [],
    [availableTags],
  );
  return (
    <Layout>
      <Layout.Header>
        <PageHeader
          extra={TABLE_LINK}
          ghost={false}
          onBack={goBack}
          title="Available charts in a list"
        />
      </Layout.Header>
      <Layout.Content>
        {map(groupedTags, ([firstLetter, tags]) => (
          <Fragment key={firstLetter}>
            <Divider orientation="left">{toUpper(firstLetter)}</Divider>
            <Row gutter={8}>
              {map(tags, (tagName) => (
                <Col key={tagName} span={6} xs={12}>
                  <TagLink
                    className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-single-line"
                    to={`/tag/${filenamify(tagName)}`}
                  >
                    {tagName}
                  </TagLink>
                </Col>
              ))}
            </Row>
          </Fragment>
        ))}
      </Layout.Content>
    </Layout>
  );
}
