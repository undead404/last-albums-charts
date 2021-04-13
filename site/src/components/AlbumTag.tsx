import { Link } from '@reach/router';
import { Col, Progress, Typography } from 'antd';
import filenamify from 'filenamify';
import includes from 'lodash/includes';
import React, { CSSProperties, useCallback } from 'react';

export interface AlbumTagProperties {
  availableTags: string[];
  tagCount: number;
  tagName: string;
}
const PROGRESS_STYLE: CSSProperties = {
  display: 'flex',
  maxWidth: '75vw',
  overflow: 'initial',
};

export default function AlbumTag({
  availableTags,
  tagCount,
  tagName,
}: AlbumTagProperties): JSX.Element {
  const formatName = useCallback(
    () => <Typography.Text title={`${tagCount}%`}>{tagName}</Typography.Text>,
    [tagCount, tagName],
  );
  if (!includes(availableTags, tagName)) {
    return null;
  }
  return (
    <Col>
      <Link to={`/tag/${filenamify(tagName)}`}>
        <Progress
          format={formatName}
          key={tagName}
          percent={tagCount}
          style={PROGRESS_STYLE}
          type="circle"
        />
      </Link>
    </Col>
  );
}
