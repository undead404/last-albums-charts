import includes from 'lodash/includes';
import startsWith from 'lodash/startsWith';

const BLACKLISTED_TAGS = [
  '<3',
  '1001 albums you must hear before you die',
  '4',
  'album i own',
  'albums',
  'albums i love',
  'albums i own',
  'albums i own on vinyl',
  'albums i want',
  'amazing',
  'awesome',
  'beautiful',
  'best',
  'best album',
  'best album ever',
  'best albums',
  'best albums ever',
  'brilliant',
  'check',
  'cd collection',
  'cds i own',
  'fav',
  'fav albums',
  'favorite album',
  'favorite albums',
  'favorite songs',
  'favorite tracks',
  'favorites',
  'favourite',
  'favourite album',
  'favourite albums',
  'favourite tracks',
  'favourites',
  'free tracks',
  'genius',
  'good',
  'great',
  'great albums',
  'great lyricists',
  'great lyrics',
  'i have this album',
  'i own this cd',
  'in my collection',
  'legend',
  'love',
  'love at first listen',
  'love it',
  'masterpiece',
  'my albums',
  'my favorite albums',
  'my favourite albums',
  'overrated',
  'own',
  'own on vinyl',
  'owned',
  'perfect',
  'perfect albums',
  'playlist',
  'rolling stone 500 greatest albums',
  'seen live',
  'shit',
  'vinyls i own',
  'wishlist',
];

export default function isTagBlacklisted(tagName: string): boolean {
  if (includes(BLACKLISTED_TAGS, tagName)) {
    return true;
  }
  if (startsWith(tagName, 'best ')) {
    return true;
  }
  if (startsWith(tagName, 'perfect ')) {
    return true;
  }
  return false;
}
