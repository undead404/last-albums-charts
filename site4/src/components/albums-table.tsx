import classNames from 'classnames';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Album } from '../types';
import formatAlbum from '../utils/format-album';

import AlbumModal from './album-modal';

interface AlbumsTableProperties {
  albumsPlaces: {
    album: Album;
    place: number;
  }[];
}

export default function AlbumsTable({ albumsPlaces }: AlbumsTableProperties) {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const albumsPlacesByDate = useMemo(
    () => sortBy(albumsPlaces, ['album.date']),
    [],
  );
  const onModalClose = useCallback(() => {
    setCurrentAlbum(null);
  }, []);
  useEffect(() => {
    forEach(albumsPlaces, (albumPlace) => {
      if (!albumPlace?.album?.numberOfTracks) {
        // eslint-disable-next-line no-console
        console.warn(
          formatAlbum(albumPlace?.album),
          'number of tracks unknown',
        );
      } else {
        // eslint-disable-next-line no-console
        console.debug(
          formatAlbum(albumPlace?.album),
          'number of tracks',
          albumPlace?.album.numberOfTracks,
        );
      }
    });
  }, [albumsPlaces]);
  return (
    <>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Album</th>
            <th scope="col">Date</th>
            <th scope="col" aria-label="Cover thumbnail"></th>
          </tr>
        </thead>
        <tbody>
          {map(albumsPlacesByDate, ({ album, place }) => (
            <tr
              key={formatAlbum(album)}
              className={classNames('album-table-row', {
                'is-selected': album === currentAlbum,
              })}
              onClick={() => setCurrentAlbum(album)}
            >
              <td>{place}</td>
              <td>{formatAlbum(album, false)}</td>
              <td>{album.date}</td>
              <td>
                {album.thumbnail && (
                  <figure className="image is-32x32">
                    <img className="is-rounded" src={album.thumbnail} />
                  </figure>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AlbumModal album={currentAlbum} onClose={onModalClose} />
    </>
  );
}
