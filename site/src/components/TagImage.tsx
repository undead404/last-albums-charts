import { Avatar, Tooltip } from 'antd';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import React from 'react';

import { Tag } from '../../types';

import getAlbumTitle from '../utils/get-album-title';

export interface TagImageProperties {
  tag: Tag;
}

export default function TagImage({ tag }: TagImageProperties): JSX.Element {
  const albumWithCover = find(
    orderBy(tag.topAlbums, ['weight'], ['desc']),
    'thumbnail',
  );
  const imageUrl = albumWithCover
    ? albumWithCover.thumbnail
    : 'https://via.placeholder.com/150';
  return (
    <Tooltip title={albumWithCover ? getAlbumTitle(albumWithCover) : undefined}>
      <Avatar src={imageUrl} />
    </Tooltip>
  );
}
