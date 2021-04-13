import { Deezer } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface DeezerLinkProperties {
  album: Album;
}

export default function DeezerLink({
  album,
}: DeezerLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={<Deezer color="#FEAA2D" />}
      url={`https://www.deezer.com/search/${encodeURIComponent(
        getAlbumTitle(album, false),
      )}/album`}
    />
  );
}
