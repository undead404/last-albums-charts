import { Link } from '@reach/router';
import { Col, Progress, Typography } from 'antd';
import filenamify from 'filenamify';
import includes from 'lodash/includes';
import React, { CSSProperties, useCallback } from 'react';
import { useRouteData } from 'react-static';

export interface AlbumTagProperties {
  tagCount: number;
  tagName: string;
}
const PROGRESS_STYLE: CSSProperties = {
  display: 'flex',
  maxWidth: '75vw',
  overflow: 'initial',
};

export default function AlbumTag({
  tagCount,
  tagName,
}: AlbumTagProperties): JSX.Element {
  const {
    availableTags: { data: availableTags } = { data: [] },
  } = useRouteData();
  const formatName = useCallback(
    () => <Typography.Text title={`${tagCount}%`}>{tagName}</Typography.Text>,
    [tagCount, tagName],
  );
  if (!includes(availableTags, tagName)) {
    return (
      <Col>
        <Progress
          key={tagName}
          format={formatName}
          percent={tagCount}
          style={PROGRESS_STYLE}
          type="circle"
        />
      </Col>
    );
  }
  return (
    <Col>
      <Link to={`/tag/${filenamify(tagName)}`}>
        <Progress
          key={tagName}
          format={formatName}
          percent={tagCount}
          style={PROGRESS_STYLE}
          type="circle"
        />
      </Link>
    </Col>
  );
}
