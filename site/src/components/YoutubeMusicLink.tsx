import { Youtubemusic } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';
import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface YoutubeMusicLinkProperties {
  album: Album;
}
const ICON = <Youtubemusic color="#FF0000" />;
export default function YoutubeMusicLink({
  album,
}: YoutubeMusicLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={ICON}
      url={`https://music.youtube.com/search?q=${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
