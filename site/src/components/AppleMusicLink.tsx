import { Applemusic } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';
import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface AppleMusicLinkProperties {
  album: Album;
}

const ICON = <Applemusic color="#000000" />;

export default function AppleMusicLink({
  album,
}: AppleMusicLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={ICON}
      url={`https://music.apple.com/in/search?term=${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
