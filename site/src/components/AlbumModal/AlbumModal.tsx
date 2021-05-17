import { Button, Card, Modal } from 'antd';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Album, Weighted } from '../../../types';
import getAlbumTitle from '../../utils/get-album-title';
import AlbumLinks from '../AlbumLinks';
import TagTag from '../TagTag';

import AlbumImage from './AlbumImage';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export interface AlbumModalProperties {
  album: Weighted<Album> | null;
  onClose: () => void;
}
const MIN_TAG_COUNT = 50;
export default function AlbumModal({
  album,
  onClose,
}: AlbumModalProperties): JSX.Element | null {
  const image = useMemo(
    () => <AlbumImage image={album?.cover || undefined} />,
    [album],
  );
  const tagsPairs = useMemo(
    () =>
      sortBy(
        filter(
          toPairs(album?.tags || undefined),
          ([, tagCount]) => tagCount > MIN_TAG_COUNT,
        ),
        ([, tagCount]) => -tagCount,
      ),
    [album],
  );
  const description = useMemo(
    () => (
      <TagsContainer>
        {map(tagsPairs, ([tagName, tagCount]) => (
          <TagTag key={tagName} count={tagCount} name={tagName} />
        ))}
      </TagsContainer>
    ),
    [tagsPairs],
  );
  const footer = useMemo(() => <Button onClick={onClose}>Close</Button>, [
    onClose,
  ]);
  const links = useMemo(() => (album ? <AlbumLinks album={album} /> : null), [
    album,
  ]);
  if (!album) {
    return null;
  }
  return (
    <Modal
      centered
      closable
      footer={footer}
      mask
      maskClosable
      onCancel={onClose}
      onOk={onClose}
      title={getAlbumTitle(album)}
      visible={!!album}
    >
      <Card cover={image} extra={links}>
        <Card.Meta description={description} title={album.rating} />
      </Card>
    </Modal>
  );
}
