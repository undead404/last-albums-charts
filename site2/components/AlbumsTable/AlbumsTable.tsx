import { Table, TableProps } from 'antd';
import find from 'lodash/find';
import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import FirebaseContext from '../../contexts/firebase';
import useLogChanges from '../../hooks/use-log-changes';
import type { Album } from '../../types';
import getAlbumKey from '../../utils/get-album-key';
import getAlbumTitle from '../../utils/get-album-title';
import AlbumModal from '../AlbumModal/AlbumModal';

import COLUMNS from './columns';

interface ColumnItem {
  album: Album;
  place: number;
}

export interface AlbumsTableProperties {
  albumPlaces?: ColumnItem[];
}

const Wrapper = styled.div`
  .ant-table-row {
    cursor: pointer;
  }
`;

export default function AlbumsTable({
  albumPlaces,
}: AlbumsTableProperties): JSX.Element {
  const { logAnalyticsEvent } = useContext(FirebaseContext);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const hideModal = useCallback(() => setCurrentAlbum(null), []);
  const onRow: TableProps<ColumnItem>['onRow'] = useCallback(
    (albumPlace: ColumnItem) => ({
      onClick() {
        setCurrentAlbum(albumPlace.album);
      },
    }),
    [],
  );
  useEffect(() => {
    if (currentAlbum) {
      logAnalyticsEvent('select_content', {
        album: getAlbumTitle(currentAlbum, true),
      });
    }
  }, [currentAlbum, logAnalyticsEvent]);
  useLogChanges('AlbumsTable', 'currentAlbum', currentAlbum);
  useLogChanges('AlbumsTable', 'albumPlaces', albumPlaces);
  useEffect(() => {
    if (!currentAlbum) {
      return;
    }
    if (
      !find(albumPlaces, {
        album: {
          artist: currentAlbum.artist,
          name: currentAlbum.name,
        },
      })
    ) {
      setCurrentAlbum(null);
    }
  }, [albumPlaces, currentAlbum]);
  const getAlbumPlaceKey = useCallback(
    (albumPlace: ColumnItem) => getAlbumKey(albumPlace.album),
    [],
  );
  return (
    <Wrapper>
      <Table
        columns={COLUMNS}
        dataSource={albumPlaces}
        loading={!albumPlaces}
        onRow={onRow}
        pagination={false}
        rowKey={getAlbumPlaceKey}
      />
      <AlbumModal album={currentAlbum} onClose={hideModal} />
    </Wrapper>
  );
}
