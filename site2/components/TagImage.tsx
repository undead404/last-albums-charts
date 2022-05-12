import { Avatar, Tooltip } from 'antd';
import React from 'react';

import type { TagForTagsPage } from '../types';

export interface TagImageProperties {
  tag: TagForTagsPage;
}

export default function TagImage({ tag }: TagImageProperties): JSX.Element {
  const imageUrl = tag.preview || 'https://via.placeholder.com/150';
  return (
    <Tooltip title={tag.title || undefined}>
      <Avatar src={imageUrl} />
    </Tooltip>
  );
}
