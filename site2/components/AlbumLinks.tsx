import React from 'react';

import type { Album } from '../types';

import AppleMusicLink from './AppleMusicLink';
import DeezerLink from './DeezerLink';
import LastfmLink from './LastfmLink';
import MusicBrainzLink from './MusicBrainzLink';
import SpotifyLink from './SpotifyLink';
import YoutubeLink from './YoutubeLink';
import YoutubeMusicLink from './YoutubeMusicLink';

export interface AlbumLinksProperties {
  album: Album;
}

export default function AlbumLinks({
  album,
}: AlbumLinksProperties): JSX.Element {
  return (
    <>
      <YoutubeLink album={album} />
      <LastfmLink album={album} />
      <MusicBrainzLink album={album} />
      <AppleMusicLink album={album} />
      <SpotifyLink album={album} />
      <DeezerLink album={album} />
      <YoutubeMusicLink album={album} />
    </>
  );
}
