import { Link } from '@reach/router';
import { TableProps } from 'antd';
import { formatISO } from 'date-fns';
import filenamify from 'filenamify';
import React from 'react';

import { TagForTagsPage } from '../../../types';
import TagImage from '../../components/TagImage';
import compareDates from '../../utils/compare-dates';
import compareStrings from '../../utils/compare-strings';

const COLUMNS: TableProps<TagForTagsPage>['columns'] = [
  {
    key: 'name',
    render(_value: unknown, tag: TagForTagsPage): JSX.Element {
      return <Link to={`/tag/${filenamify(tag.name)}`}>{tag.name}</Link>;
    },
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): -1 | 0 | 1 {
      return compareStrings(tag1.name, tag2.name);
    },
    title: 'Name',
  },
  {
    align: 'right',
    key: 'thumbnail',
    render(_value: unknown, tag: TagForTagsPage): JSX.Element {
      return <TagImage tag={tag} />;
    },
    responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  },
  {
    key: 'listUpdatedAt',
    render(_value: unknown, tag: TagForTagsPage): string {
      const when = tag.listUpdatedAt || tag.listCheckedAt;
      if (!when) {
        return 'Never';
      }
      return formatISO(when);
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): number {
      const date1 = tag1.listUpdatedAt || tag1.listCheckedAt;
      const date2 = tag2.listUpdatedAt || tag2.listCheckedAt;
      return compareDates(date1, date2);
    },
    title: 'List generated at',
  },
  {
    key: 'albumsScrapedAt',
    render(_value: unknown, tag: TagForTagsPage): string {
      return tag.albumsScrapedAt ? formatISO(tag.albumsScrapedAt) : 'Never';
    },
    responsive: ['lg', 'xl', 'xxl'],
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): number {
      return compareDates(tag1.albumsScrapedAt, tag2.albumsScrapedAt);
    },
    title: 'Albums scraped at',
  },
  {
    key: 'power',
    render(_value: unknown, tag: TagForTagsPage): string {
      return (tag.power || 0).toLocaleString('uk-UA');
    },
    responsive: ['xl', 'xxl'],
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): -1 | 0 | 1 {
      if ((tag1.power || 0) < (tag2.power || 0)) {
        return -1;
      }
      if ((tag1.power || 0) > (tag2.power || 0)) {
        return 1;
      }
      return 0;
    },
    title: 'Power',
  },
];
export default COLUMNS;
