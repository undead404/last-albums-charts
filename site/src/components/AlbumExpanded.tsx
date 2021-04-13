import { Descriptions, DescriptionsProps, Image, Row, RowProps } from 'antd';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import React, { CSSProperties, useMemo } from 'react';

import { Album } from '../../types';

import getAlbumTitle from '../utils/get-album-title';

import AlbumLinks from './AlbumLinks';
import AlbumTag from './AlbumTag';

export interface AlbumExpandedProperties {
  album: Album;
  tagName: string;
}

const MIN_TAG_COUNT = 5;

const VERTICAL_GUTTER = 16;
const TAGS_GUTTER: RowProps['gutter'] = [
  VERTICAL_GUTTER,
  { xs: 8, sm: 16, md: 24, lg: 32 },
];
const TAGS_ROW_STYLE: CSSProperties = {
  alignItems: 'center',
  height: '100%',
  justifyContent: 'space-evenly',
};
const COLUMN: DescriptionsProps['column'] = {
  xxl: 2,
  xl: 2,
  lg: 2,
  md: 2,
  sm: 1,
  xs: 1,
};

export default function AlbumExpanded({
  album,
  tagName,
}: AlbumExpandedProperties): JSX.Element {
  const tagsPairs = useMemo(
    () =>
      sortBy(
        filter(
          toPairs(album.tags || undefined),
          ([, tagCount]) => tagCount > MIN_TAG_COUNT,
        ),
        ([, tagCount]) => -tagCount,
      ),
    [album.tags],
  );
  return (
    <Descriptions
      bordered
      column={COLUMN}
      layout="vertical"
      title={getAlbumTitle(album)}
    >
      <Descriptions.Item label="Cover">
        <Image
          preview={false}
          src={album.cover || 'https://via.placeholder.com/450'}
        />
      </Descriptions.Item>
      <Descriptions.Item label="Tags">
        <Row gutter={TAGS_GUTTER} style={TAGS_ROW_STYLE}>
          {map(tagsPairs, ([tagNameItem, tagCount]) => (
            <AlbumTag
              key={tagNameItem}
              tagCount={tagCount}
              tagName={tagNameItem}
            />
          ))}
        </Row>
      </Descriptions.Item>
      <Descriptions.Item label="Released at">{album.date}</Descriptions.Item>
      <Descriptions.Item label="Links">
        <AlbumLinks album={album} />
      </Descriptions.Item>
      <Descriptions.Item label="Rating">
        {tagName} #{album.rating}
      </Descriptions.Item>
    </Descriptions>
  );
}
