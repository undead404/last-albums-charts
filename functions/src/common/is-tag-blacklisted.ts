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
  'annoying',
  'approved',
  'attention whore',
  'availableonemusic',
  'awesome',
  'awful',
  'bad',
  'bad music',
  'bad taste',
  'beautiful',
  'best',
  'best album',
  'best album ever',
  'best albums',
  'best albums ever',
  'boring',
  'brilliant',
  'bullshit',
  'cant sing',
  'check',
  'cd collection',
  'cds i own',
  'check out',
  'cool',
  'crap',
  'crappy english versions of german stuff',
  'cronowish power',
  'decent',
  'derivative',
  'discover',
  'disgrace to society',
  'dumb',
  'epic fail',
  'exciting',
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
  'favs of nocci',
  'flop',
  'free tracks',
  'fully streamable albums',
  'garbage',
  'generic',
  'genius',
  'good',
  'great',
  'great albums',
  'great lyricists',
  'great lyrics',
  'handleliste',
  'hipster garabe',
  'hipster garbage',
  'horrible',
  'i have this album',
  'i own this cd',
  'idiot',
  'in my collection',
  'kacke',
  'lame',
  'legend',
  'love',
  'love at first listen',
  'love it',
  'masterpiece',
  'mein house',
  'mein virtuelles musikregal',
  'meine party',
  'milestones',
  'most amazing bands in the fucking world',
  'my albums',
  'my favorite albums',
  'my favourite albums',
  'no talent',
  'officially shit',
  'on repeat',
  'overrated',
  'own',
  'own on vinyl',
  'owned',
  'pathetic',
  'people who have no talent',
  'perfect',
  'perfect albums',
  'playlist',
  'pretentious',
  'rather good stuff',
  'ridiculous',
  'rolling stone 500 greatest albums',
  'satanic garbage',
  'satanic shit',
  'scheisse',
  'seen live',
  'sellout',
  'shit',
  'shitcore',
  'slut',
  'so zorry',
  'streamable',
  'stupid',
  'suavesfabio power',
  'superr',
  'talentless',
  'terrible',
  'to check out',
  'totally fully albums',
  'trash',
  'trite',
  'trying too hard',
  'ugly',
  'ugly vocalists',
  'uncreative',
  'underrated',
  'unforgettable songs from when i was a teenager',
  'unlistenable',
  'untalented',
  'vinyls i own',
  'waahh i love it',
  'what should i listen to next',
  'whore',
  'wishlist',
  'worst',
  'worst of 2017',
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
  if (startsWith(tagName, 'valkyriex')) {
    return true;
  }
  if (startsWith(tagName, 'valkyeriex')) {
    return true;
  }
  if (startsWith(tagName, 'harukaex')) {
    return true;
  }
  return false;
}
