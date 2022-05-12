import { Tag as AntTag, Tooltip } from 'antd';
import filenamify from 'filenamify';
import includes from 'lodash/includes';
import Link from 'next/link';
import React, { useContext } from 'react';
import styled from 'styled-components';

import AvailableTagsContext from '../contexts/available-tags';

export interface TagTagProperties {
  count: number;
  name: string;
}

const BoldTag = styled(AntTag)`
  cursor: pointer;
  font-weight: bold;
`;

export default function TagTag({ count, name }: TagTagProperties): JSX.Element {
  const availableTags = useContext(AvailableTagsContext);
  if (includes(availableTags, name)) {
    return (
      <Link
        // className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-single-line"
        href={`/tag/${filenamify(name)}`}
      >
        <Tooltip title={`${count}%`}>
          <BoldTag>{name}</BoldTag>
        </Tooltip>
      </Link>
    );
  }
  return (
    <Tooltip title={`${count}%`}>
      <AntTag>{name}</AntTag>
    </Tooltip>
  );
}
