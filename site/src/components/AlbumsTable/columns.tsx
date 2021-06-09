import { Avatar, TableProps, Typography } from 'antd';
import React from 'react';

import { Album } from '../../../types';
import compareStrings from '../../utils/compare-strings';
import getAlbumTitle from '../../utils/get-album-title';
import AlbumLinks from '../AlbumLinks';

const COLUMNS: TableProps<Album>['columns'] = [
  {
    dataIndex: 'rating',
    // render(_value, _album, index) {
    //   return `${index + 1}`;
    // },
    sorter(album1: Album, album2: Album): -1 | 0 | 1 {
      if (album1.rating < album2.rating) {
        return -1;
      }
      if (album1.rating > album2.rating) {
        return 1;
      }
      return 0;
    },
    title: '#',
  },
  {
    key: 'title',
    render(_value: unknown, album: Album): JSX.Element {
      return <Typography.Text>{getAlbumTitle(album, false)}</Typography.Text>;
    },
    title: 'Name',
  },
  {
    dataIndex: 'date',
    defaultSortOrder: 'ascend',
    sorter(album1: Album, album2: Album): -1 | 0 | 1 {
      return compareStrings(album1.date || '', album2.date || '');
    },
    title: 'Released at',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value: unknown, album: Album): JSX.Element {
      return (
        <Avatar src={album.thumbnail || 'https://via.placeholder.com/150'} />
      );
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    // responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'links',
    render(_value: unknown, album: Album): JSX.Element {
      return <AlbumLinks album={album} />;
    },
    responsive: ['lg', 'xl', 'xxl'],
    title: 'Links',
  },
];
export default COLUMNS;
