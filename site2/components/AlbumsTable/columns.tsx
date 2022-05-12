import { Avatar, TableProps, Typography } from 'antd';
import startsWith from 'lodash/startsWith';
import React from 'react';

import type { Album } from '../../types';
import getAlbumTitle from '../../utils/get-album-title';
import AlbumLinks from '../AlbumLinks';

interface ColumnItem {
  album: Album;
  place: number;
}

const COLUMNS: TableProps<ColumnItem>['columns'] = [
  {
    dataIndex: 'place',
    // render(_value, _album, index) {
    //   return `${index + 1}`;
    // },
    sorter(albumPlace1: ColumnItem, albumPlace2: ColumnItem): -1 | 0 | 1 {
      if (albumPlace1.place < albumPlace2.place) {
        return -1;
      }
      if (albumPlace1.place > albumPlace2.place) {
        return 1;
      }
      return 0;
    },
    title: '#',
  },
  {
    key: 'title',
    render(_value: unknown, albumPlace: ColumnItem): JSX.Element {
      return (
        <Typography.Text>
          {getAlbumTitle(albumPlace.album, false)}
        </Typography.Text>
      );
    },
    title: 'Name',
  },
  {
    defaultSortOrder: 'ascend',
    key: 'date',
    sorter(albumPlace1: ColumnItem, albumPlace2: ColumnItem): -1 | 0 | 1 {
      if (!albumPlace1.album.date && !albumPlace2.album.date) {
        return 0;
      }
      if (!albumPlace1.album.date) {
        return 1;
      }
      if (!albumPlace2.album.date) {
        return -1;
      }
      if ((albumPlace1.album.date || '') < (albumPlace2.album.date || '')) {
        if (startsWith(albumPlace2.album.date, albumPlace1.album.date)) {
          return 1;
        }
        return -1;
      }
      if ((albumPlace1.album.date || '') > (albumPlace2.album.date || '')) {
        if (startsWith(albumPlace1.album.date, albumPlace2.album.date)) {
          return -1;
        }
        return 1;
      }
      return 0;
    },
    render(_value: unknown, albumPlace: ColumnItem): string {
      return albumPlace.album.date || 'unknown';
    },
    title: 'Released at',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value: unknown, albumPlace: ColumnItem): JSX.Element {
      return (
        <Avatar
          src={albumPlace.album.thumbnail || 'https://via.placeholder.com/150'}
        />
      );
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    // responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'links',
    render(_value: unknown, albumPlace: ColumnItem): JSX.Element {
      return <AlbumLinks album={albumPlace.album} />;
    },
    responsive: ['lg', 'xl', 'xxl'],
    title: 'Links',
  },
];
export default COLUMNS;
