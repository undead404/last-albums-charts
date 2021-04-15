import { Link } from '@reach/router';
import { Tag as AntTag, Tooltip } from 'antd';
import filenamify from 'filenamify';
import includes from 'lodash/includes';
import React from 'react';
import { useRouteData } from 'react-static';

export interface TagTagProperties {
  count: number;
  name: string;
}

export default function TagTag({ count, name }: TagTagProperties): JSX.Element {
  const {
    availableTags: { data: availableTags } = { data: [] },
  } = useRouteData();
  const tag = (
    <Tooltip title={`${count}%`}>
      <AntTag>{name}</AntTag>
    </Tooltip>
  );
  if (includes(availableTags, name)) {
    return (
      <Link
        className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-single-line"
        to={`/tag/${filenamify(name)}`}
      >
        {tag}
      </Link>
    );
  }
  return tag;
}
