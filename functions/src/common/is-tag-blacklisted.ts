import endsWith from 'lodash/endsWith';
import includes from 'lodash/includes';
import startsWith from 'lodash/startsWith';

const BLACKLISTED_TAGS = [
  '<3',
  '1001 albums you must hear before you die',
  '2013 albums',
  '2014 releases',
  '2014: albums',
  '4',
  '8 soothing songs for rut',
  'a',
  'agitada',
  'album',
  'album i own',
  'albums',
  'albums i have',
  'albums i have listened',
  'albums i love',
  'albums i own',
  'albums i own on vinyl',
  'albums i want',
  'albums that i might like to buy',
  'all',
  'all aboard the failboat',
  'all things annoying in the world put together into one stupid bitch',
  'all time great albums',
  'amazing',
  'ambient dildocore',
  'annoying',
  'approved',
  'approximately 1000 times less pleasant than extreme anal caving',
  'as awesome has having testicles in your face when you wake up',
  'asscore',
  'attention whore',
  'availableonemusic',
  'awesome',
  'awful',
  'bad',
  'bad music',
  'bad taste',
  'barneycore',
  'beautiful',
  'beautiful album covers',
  'beauty',
  'best',
  'best album',
  'best album ever',
  'best albums',
  'best albums ever',
  'better die than listen to this',
  'better than radiohead',
  'bizarre',
  'boring',
  'brilliant',
  'brilliant record',
  'brutal fagcore',
  'bullshit',
  'buy',
  'cant sing',
  'catchy',
  'cd',
  'check',
  'check out - friends',
  'cd collection',
  'cds i know i love',
  'cds i own',
  'check out',
  'classic albums',
  'colossal faggot',
  'compact discs i own',
  'con artist',
  'cool',
  'coolest album art',
  'crap',
  'crappy english versions of german stuff',
  'creamed my pants',
  'cronowish power',
  'cunt',
  'darksky fm',
  'darkwave my ass',
  'decent',
  'deep',
  'derivative',
  'det snurrar i min skalle',
  'deviliscious432',
  'dicky',
  'dildocore',
  'discover',
  'disgrace to society',
  'dont have',
  'douchebag',
  'download',
  'dr gay and his gang of faggots',
  'dull',
  'dumb',
  'ecstasy',
  'emogaycore',
  'emusic download',
  'ep',
  'epic bitch',
  'epic fail',
  'essential albums',
  'everything',
  'everytime you listen to this crap a truck hits a granny',
  'excellent streamability',
  'exciting',
  'experimental my ass',
  'faggot',
  'failure',
  'fap',
  'fart machine',
  'fat',
  'fav',
  'fav album',
  'fav albums',
  'favorite',
  'favorite album',
  'favorite albums',
  'favorite bm',
  'favorite instrumentals',
  'favorite live albums',
  'favorite songs',
  'favorite tracks',
  'favorites',
  'favourite',
  'favourite album',
  'favourite albums',
  'favourite songs',
  'favourite tracks',
  'favourites',
  'favs of nocci',
  'fellating the bottom of a bottle of wine',
  'fip',
  'flawless',
  'flop',
  'for howisya to hear',
  'free complete album to check out',
  'free tracks',
  'freedom',
  'fucking awesome',
  'fully streamable',
  'fully streamable albums',
  'fun',
  'funny',
  'garbage',
  'gay',
  'gay metal',
  'gay nigger black metal',
  'gaycore',
  'generic',
  'genius',
  'glorify my drug usage',
  'goatse',
  'god-like',
  'god-tier guitar',
  'godlike drumming',
  'good',
  'gossip',
  'goth music for pussies',
  'gothic my ass',
  'grade a',
  'great',
  'great album',
  'great album covers',
  'great albums',
  'great finnish albums',
  'great live band go see them',
  'great lyricists',
  'great lyrics',
  'greatest hits',
  'guilty pleasure',
  'handleliste',
  'has',
  'hate my nation',
  'hilarious',
  'hipster garabe',
  'hipster garbage',
  'hiv positive',
  'homeless on the streets giving handjobs for crack',
  'horrible',
  'hot',
  'i have this album',
  'i hope you get shot',
  'i love singing along',
  'i own this cd',
  'i would rather beat myself to death with a hammer than listen to this',
  'i would rather eat shit for the rest of my life than listen to this',
  'idiot',
  'idioten',
  'idiotic',
  'immortal albums',
  'in my collection',
  'internet',
  'ironic',
  'all-time-favorite',
  'its not indie assholes',
  'just put your what what deep in my butt butt and let juice fly and ill soak up the what what in the butt butt penis fish meat carebears',
  'k1r7m',
  'kacke',
  'kategorische elative',
  'kept in freezer to be served as dinner',
  'kitsch',
  'known albums',
  'lame',
  'laptop',
  'leather daddy rape soundtrack',
  'legally owned albums',
  'legend',
  'legendary night music for chads',
  'life',
  'list',
  'listen',
  'lol',
  'lolfest',
  'love',
  'love at first listen',
  'love it',
  'lovely',
  'masterpiece',
  'me',
  'mediocore',
  'mediocre',
  'megadeth',
  'mein house',
  'mein virtuelles musikregal',
  'meine party',
  'melodic dildocore',
  'metal for teletubbies',
  'micropenis',
  'mighty albums',
  'milestones',
  'misanthropic gay romance nostalgia metal',
  'misc',
  'monakitty432',
  'more gay than a san fransisco man in a hawaiian shirt sniffing some liquid gold and watching sex in the city',
  'moronic',
  'most amazing bands in the fucking world',
  'music to listen while pederasting',
  'my albums',
  'my cat starts to vomit uncontrollably when listening to this',
  'my collection',
  'my favorite albums',
  'my favorites',
  'my favourite albums',
  'my hatred of this is so thick and rich that you could drizzle it over pancakes',
  'my little kvlts',
  'my private work station',
  'my top 10',
  'my vinyl',
  'nancykitten all time favourite albums',
  'nazi shit',
  'near-flawless albums',
  'need to check this out',
  'nice album art',
  'no talent',
  'not on my computer anymore',
  'of',
  'officially retarded',
  'officially shit',
  'on repeat',
  'one of the greatest album i ever heard',
  'ot-free listening',
  'overrated',
  'own',
  'own on vinyl',
  'owned',
  'part of my vinyl collection',
  'pathetic',
  'people i dont want to have sex with',
  'people who have no talent',
  'perfect',
  'perfect albums',
  'pile of plastic',
  'piss',
  'pitchfork best new music',
  'pitchfork: best new music',
  'playlist',
  'please assassinate',
  'posluchac',
  'pretentious',
  'psycho',
  'pussycore',
  'puuma85 musicians',
  'queen of flop',
  'quirky',
  'raped in public by barney',
  'rapes my ears',
  'rather good stuff',
  'really violent sex that is not only extremely bloody but also can scar people forever as well as haunt people in their dreams and plus it can turn innocent people into bloodthirsty killers that have no mercy for their victims',
  'recent music heroes',
  'records i consider buying',
  'registret',
  'retarded',
  'review on schwermetall-ch',
  'reviewed',
  'reviewed in the guardian',
  'ridiculous',
  'rolling stone 500 greatest albums',
  'rousing',
  'rsyniklaced',
  'satanic dildocore',
  'satanic garbage',
  'satanic shit',
  'scheisse',
  'schoene musik',
  'scryed edward tracks power',
  'seen live',
  'sellout',
  'sex',
  'sexy',
  'shit',
  'shit being pumped into my head through a fire hose',
  'shit only a fag would listen to',
  'shit only a retard would listen to',
  'shitcore',
  'sick',
  'signed album i own',
  'sincerely yours',
  'slut',
  'slut pop',
  'so bad its good',
  'so zorry',
  'songs i never get sick of',
  'songs played obsessively on repeat at some point',
  'songs to play after you sit for an hour waiting for a bus',
  'sounds like a woman driving a vehicle with a manual transmission',
  'spermgrind',
  'streamable',
  'stupid',
  'stylish',
  'suavesfabio power',
  'superb song to drive to',
  'superr',
  'talentless',
  'technical perfection',
  'terrible',
  'test',
  'the absolute finest piece of music which has ever stroken my ears and soul',
  'the best',
  'the gayest thing ever to happen to music',
  'the victims of chernobyl',
  'the worst thing ever to happen to music',
  'they look like serial prostitutes with fake dildos to scare little kids',
  'this album is pretty neat though',
  'this is garbage and you know it',
  'to check out',
  'top',
  'torture for my ears',
  'totally fully albums',
  'trash',
  'trashbag filled with vomit',
  'trite',
  'troll',
  'trying too hard',
  'ugly',
  'ugly vocalists',
  'uglycore',
  'uncreative',
  'under 2000 listeners',
  'under 87665009756551896889899987854287765479831234470946568933668823144561 listeners',
  'underrated',
  'unforgettable songs from when i was a teenager',
  'unlistenable',
  'untalented',
  'used at guantanamo bay',
  'vinyl',
  'vinyl i own',
  'vinyls i own',
  'violates the geneva convention',
  'visual gay',
  'volatile',
  'waahh i love it',
  'wanking and crying while running a marathon',
  'what a waste of site resources',
  'what should i listen to next',
  'when i listen to them i dont have to buy peptobysmol anymore',
  'whore',
  'why does this person have to haunt decent people even on last fm',
  'will you tell me the secret of flop',
  'winamp',
  'wishlist',
  'worst',
  'worst ever',
  'worthless',
  'wow',
  'wtf',
  'you candle sniffing fuck fence go climb a wall of dicks you double nigger',
  'your ears will bleed',
];

const MIN_TAG_NAME_LENGTH = 3;
const NUMERIC_RE = /^\d+$/;

export default function isTagBlacklisted(tagName: string): boolean {
  if (tagName.length < MIN_TAG_NAME_LENGTH) {
    return true;
  }
  if (includes(BLACKLISTED_TAGS, tagName)) {
    return true;
  }
  if (startsWith(tagName, ' ')) {
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
  if (startsWith(tagName, 'valkyreiex')) {
    return true;
  }
  if (startsWith(tagName, 'top ')) {
    return true;
  }
  if (startsWith(tagName, 'worst of ')) {
    return true;
  }
  if (startsWith(tagName, 'worse than ')) {
    return true;
  }
  if (endsWith(tagName, ' stars')) {
    return true;
  }
  if (startsWith(tagName, 'fucking great ')) {
    return true;
  }
  if (NUMERIC_RE.test(tagName)) {
    return true;
  }
  if (endsWith(tagName, 'buttcore')) {
    return true;
  }
  if (startsWith(tagName, 'my gang')) {
    return true;
  }
  return false;
}
