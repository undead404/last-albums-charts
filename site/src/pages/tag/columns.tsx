import { Avatar, TableProps, Typography } from 'antd';
import React from 'react';

import { Album, Weighted } from '../../../types';
import AlbumLinks from '../../components/AlbumLinks';
import compareStrings from '../../utils/compare-strings';
import getAlbumTitle from '../../utils/get-album-title';
import stopPropagation from '../../utils/stop-propagation';

const COLUMNS: TableProps<Weighted<Album>>['columns'] = [
  {
    dataIndex: 'rating',
    sorter(album1: Weighted<Album>, album2: Weighted<Album>): -1 | 0 | 1 {
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
    render(_value: unknown, album: Weighted<Album>): JSX.Element {
      return (
        <Typography.Text copyable onClick={stopPropagation}>
          {getAlbumTitle(album, false)}
        </Typography.Text>
      );
    },
    title: 'Name',
  },
  {
    dataIndex: 'date',
    defaultSortOrder: 'ascend',
    sorter(album1: Weighted<Album>, album2: Weighted<Album>): -1 | 0 | 1 {
      return compareStrings(album1.date || '', album2.date || '');
    },
    title: 'Released at',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value: unknown, album: Weighted<Album>): JSX.Element {
      return (
        <Avatar src={album.thumbnail || 'https://via.placeholder.com/150'} />
      );
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    // responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'links',
    render(_value: unknown, album: Weighted<Album>): JSX.Element {
      return <AlbumLinks album={album} />;
    },
    responsive: ['lg', 'xl', 'xxl'],
    title: 'Links',
  },
];

export default COLUMNS;
