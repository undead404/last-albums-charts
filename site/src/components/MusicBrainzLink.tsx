import { Musicbrainz } from '@icons-pack/react-simple-icons';
import React from 'react';

import { Album } from '../../types';

import IconLink from './IconLink';

export interface MusicBrainzLinkProperties {
  album: Album;
}
const ICON = <Musicbrainz color="#BA478F" />;
export default function MusicBrainzLink({
  album,
}: MusicBrainzLinkProperties): JSX.Element | null {
  if (!album.mbid) {
    return null;
  }
  return (
    <IconLink
      icon={ICON}
      url={`https://musicbrainz.org/release/${album.mbid}`}
    />
  );
}
