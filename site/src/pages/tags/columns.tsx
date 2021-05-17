import { Link } from '@reach/router';
import { TableProps } from 'antd';
import formatISO from 'date-fns/formatISO';
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
      const when = tag.listUpdatedAt || tag.listCreatedAt;
      if (!when) {
        return 'Never';
      }
      return formatISO(when);
    },
    responsive: ['md', 'lg', 'xl', 'xxl'],
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): number {
      return compareDates(
        tag1.listUpdatedAt || tag1.listCreatedAt,
        tag2.listUpdatedAt || tag2.listCreatedAt,
      );
    },
    title: 'List generated at',
  },
  {
    key: 'lastProcessedAt',
    render(_value: unknown, tag: TagForTagsPage): string {
      return tag.lastProcessedAt ? formatISO(tag.lastProcessedAt) : 'Never';
    },
    responsive: ['lg', 'xl', 'xxl'],
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): number {
      return compareDates(tag1.lastProcessedAt, tag2.lastProcessedAt);
    },
    title: 'Albums scraped at',
  },
  {
    dataIndex: 'power',
    responsive: ['xl', 'xxl'],
    sorter(tag1: TagForTagsPage, tag2: TagForTagsPage): -1 | 0 | 1 {
      if (tag1.power < tag2.power) {
        return -1;
      }
      if (tag1.power > tag2.power) {
        return 1;
      }
      return 0;
    },
    title: 'Weight',
  },
];
export default COLUMNS;
