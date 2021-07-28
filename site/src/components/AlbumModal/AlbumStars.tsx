import { Tooltip } from 'antd';
import map from 'lodash/map';
import React from 'react';
import { AiTwotoneStar } from 'react-icons/ai';

const COLORS = new Map([
  /* eslint-disable no-magic-numbers */
  [1, '#FFD700'],
  [2, '#C0C0C0'],
  [3, '#CD7F32'],
  [4, '#FF0000'],
  [5, '#FF0000'],
  [6, '#FF0000'],
  [7, '#FF0000'],
  [8, '#FF0000'],
  [9, '#FF0000'],
  [10, '#FF0000'],
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
        const color = COLORS.get(tagPlace) || '#000000';
        return (
          <Tooltip
            key={tagName}
            placement="bottom"
            title={`#${tagPlace} ${tagName}`}
          >
            <AiTwotoneStar color={color} />
          </Tooltip>
        );
      })}
    </>
  );
}
