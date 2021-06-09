import { Table, TableProps } from 'antd';
import find from 'lodash/find';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Album } from '../../../types';
import getAlbumKey from '../../utils/get-album-key';
import AlbumModal from '../AlbumModal/AlbumModal';

import COLUMNS from './columns';

export interface AlbumsTableProperties {
  albums?: Album[];
}

const Wrapper = styled.div`
  .ant-table-row {
    cursor: pointer;
  }
`;

export default function AlbumsTable({
  albums,
}: AlbumsTableProperties): JSX.Element {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const hideModal = useCallback(() => setCurrentAlbum(null), []);
  const onRow: TableProps<Album>['onRow'] = useCallback(
    (album) => ({
      onClick() {
        setCurrentAlbum(album);
      },
    }),
    [],
  );
  useEffect(() => {
    if (!currentAlbum) {
      return;
    }
    if (
      !find(albums, { artist: currentAlbum.artist, name: currentAlbum.name })
    ) {
      setCurrentAlbum(null);
    }
  }, [albums, currentAlbum]);
  return (
    <Wrapper>
      <Table
        columns={COLUMNS}
        dataSource={albums}
        loading={!albums}
        onRow={onRow}
        pagination={false}
        rowKey={getAlbumKey}
      />
      <AlbumModal album={currentAlbum} onClose={hideModal} />
    </Wrapper>
  );
}
