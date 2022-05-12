import { Spotify } from '@icons-pack/react-simple-icons';
import React from 'react';

import type { Album } from '../types';
import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface SpotifyLinkProperties {
  album: Album;
}
const ICON = <Spotify color="#1ED760" />;
export default function SpotifyLink({
  album,
}: SpotifyLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={ICON}
      url={`https://open.spotify.com/search/${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
