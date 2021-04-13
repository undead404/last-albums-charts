import { Youtubemusic } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface YoutubeMusicLinkProperties {
  album: Album;
}

export default function YoutubeMusicLink({
  album,
}: YoutubeMusicLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={<Youtubemusic color="#FF0000" />}
      url={`https://music.youtube.com/search?q=${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
