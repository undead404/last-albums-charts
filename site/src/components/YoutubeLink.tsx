import { Youtube } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import getAlbumTitle from '../utils/get-album-title';

import IconLink from './IconLink';

export interface YoutubeLinkProperties {
  album: Album;
}

export default function YoutubeLink({
  album,
}: YoutubeLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={<Youtube color="#FF0000" />}
      url={`https://www.youtube.com/results?search_query=${encodeURIComponent(
        getAlbumTitle(album, false),
      )}`}
    />
  );
}
