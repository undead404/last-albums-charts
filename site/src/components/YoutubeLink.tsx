import { Youtube } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';
import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface YoutubeLinkProperties {
  album: Album;
}
const ICON = <Youtube color="#FF0000" />;
export default function YoutubeLink({
  album,
}: YoutubeLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={ICON}
      url={`https://www.youtube.com/results?search_query=${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
