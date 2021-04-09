export interface Album {
  artist: string;
  cover?: null | string;
  date?: null | string;
  duration: number | null;
  listeners: number | null;
  mbid: string | null;
  name: string;
  numberOfTracks: number | null;
  playcount: number | null;
  tags: { [name: string]: number } | null;
  thumbnail?: null | string;
}

export interface Tag {
  name: string;
  lastProcessedAt: null | Date;
  listCreatedAt: null | Date;
  power: number;
  topAlbums?: Album[] | null;
}

export interface SerializedTag
  extends Omit<Tag, 'lastProcessedAt' | 'listCreatedAt'> {
  lastProcessedAt: null | string;
  listCreatedAt: null | string;
}
