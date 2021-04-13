import { Spotify } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface SpotifyLinkProperties {
  album: Album;
}

export default function SpotifyLink({
  album,
}: SpotifyLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={<Spotify color="#1ED760" />}
      url={`https://open.spotify.com/search/${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
