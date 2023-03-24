import padStart from 'lodash/padStart';
import toLower from 'lodash/toLower';
import toString from 'lodash/toString';

import type { AlbumPlaceItem } from '../types';

import formatAlbum from './format-album';

const MAX_PLACE_DIGIT_NUMBER = 3;
const YEAR_MONTH_DATE_LENGTH = '2000-01'.length;
const YEAR_MONTH_DAY_DATE_LENGTH = '2000-01-01'.length;

const ALBUMS_SORT_KEYS = {
  album: (albumPlace: AlbumPlaceItem) =>
    toLower(formatAlbum(albumPlace.album, false)),
  date: (albumPlace: AlbumPlaceItem) => {
    let { date } = albumPlace.album;
    if (!date) {
      return date;
    }
    if (date.length < YEAR_MONTH_DATE_LENGTH) {
      date += '-99';
    }
    if (date.length < YEAR_MONTH_DAY_DATE_LENGTH) {
      date += '-99';
    }
    return date;
  },
  place: (albumPlace: AlbumPlaceItem) =>
    padStart(toString(albumPlace.place), MAX_PLACE_DIGIT_NUMBER, '0'),
};

export default ALBUMS_SORT_KEYS;
