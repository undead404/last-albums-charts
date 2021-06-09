import { StarTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';
import map from 'lodash/map';
import React from 'react';

const COLORS = new Map([
  /* eslint-disable no-magic-numbers */
  [1, '#FFD700'],
  [2, '#C0C0C0'],
  [3, '#CD7F32'],
  [4, '#FF0000'],
  [5, '#FF8000'],
  [6, '#FFFF00'],
  [7, '#00FF00'],
  [8, '#0000FF'],
  [9, '#3F00FF'],
  [10, '#7F00FF'],
  /* eslint-enable no-magic-numbers */
]);

export interface AlbumStarsProperties {
  places: {
    [tagName: string]: number;
  };
}

export default function AlbumStars({
  places,
}: AlbumStarsProperties): JSX.Element {
  return (
    <>
      {map(places, (tagPlace, tagName) => {
        if (!COLORS.has(tagPlace)) {
          return null;
        }
        return (
          <Tooltip key={tagName} title={`#${tagPlace} ${tagName}`}>
            <StarTwoTone twoToneColor={COLORS.get(tagPlace)} />
          </Tooltip>
        );
      })}
    </>
  );
}
