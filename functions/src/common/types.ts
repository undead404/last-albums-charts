import { ObjectId, WithId } from 'mongodb';

export interface AlbumRecord {
  artist: string;
  cover?: null | string;
  date?: null | string;
  duplicateOf?: ObjectId;
  duration: number | null;
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
  power: number;
  topAlbums?: WithId<AlbumRecord>[];
}

export type Weighted<T> = T & {
  readonly weight: number;
};
export interface SerializableAlbum extends Omit<AlbumRecord, 'duplicateOf'> {
  duplicateOf?: string;
  id: string;
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
