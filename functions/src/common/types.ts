import { ObjectId } from 'mongodb';

export interface AlbumRecord {
  artist: string;
  cover?: null | string;
  date?: null | string;
  duplicateOf?: ObjectId;
  duration: number | null;
  hidden?: boolean;
  listeners: number | null;
  mbid: string | null;
  name: string;
  numberOfTracks: number | null;
  playcount: number | null;
  tags: { [name: string]: number } | null;
  thumbnail?: null | string;
}

export interface TagRecord {
  name: string;
  lastProcessedAt: null | Date;
  listCreatedAt: null | Date;
  listUpdatedAt?: Date;
  power: number;
  topAlbums?: AlbumRecord[] | null;
}

export type Weighted<T> = T & {
  readonly weight: number;
};
export interface SerializableAlbum extends Omit<AlbumRecord, 'duplicateOf'> {
  duplicateOf?: string;
  // id: string;
}

export type SerializableTag = Omit<
  TagRecord,
  'lastProcessedAt' | 'listCreatedAt' | 'topAlbums'
> & {
  id: string;
  lastProcessedAt: null | string;
  listCreatedAt: null | string;
  topAlbums?: SerializableAlbum[];
};

export type AlbumAmqpPayload = Pick<AlbumRecord, 'artist' | 'mbid' | 'name'>;

export type Rated<T> = T & {
  rating: number;
};
