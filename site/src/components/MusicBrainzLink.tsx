import { Musicbrainz } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import IconLink from './IconLink';

export interface MusicBrainzLinkProperties {
  album: Album;
}

export default function MusicBrainzLink({
  album,
}: MusicBrainzLinkProperties): JSX.Element {
  if (!album.mbid) {
    return null;
  }
  return (
    <IconLink
      icon={<Musicbrainz color="#BA478F" />}
      url={`https://musicbrainz.org/release/${album.mbid}`}
    />
  );
}
