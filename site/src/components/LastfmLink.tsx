import { LastDotFm } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import IconLink from './IconLink';

export interface LastfmLinkProperties {
  album: Album;
}

export default function LastfmLink({
  album,
}: LastfmLinkProperties): JSX.Element {
  return (
    <IconLink
      icon={<LastDotFm color="#D51007" />}
      url={`https://last.fm/music/${encodeURIComponent(
        album.artist,
      )}/${encodeURIComponent(album.name)}`}
    />
  );
}
