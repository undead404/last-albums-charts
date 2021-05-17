export type Weighted<T> = T & {
  weight: number;
};

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
  rating: number;
  tags: { [name: string]: number } | null;
  thumbnail?: null | string;
}

export interface Tag {
  name: string;
  lastProcessedAt: null | Date;
  listCreatedAt: null | Date;
  listUpdatedAt?: Date;
  power: number;
  topAlbums?: Weighted<Album>[] | null;
}

export interface SerializedTag
  extends Omit<Tag, 'lastProcessedAt' | 'listCreatedAt' | 'listUpdatedAt'> {
  lastProcessedAt: null | string;
  listCreatedAt: null | string;
  listUpdatedAt?: string;
}

export type TagForTagsPage = Omit<Tag, 'topAlbums'> & {
  preview: string;
  title: string;
};

export interface SerializedTagForTagsPage
  extends Omit<
    TagForTagsPage,
    'lastProcessedAt' | 'listCreatedAt' | 'listUpdatedAt'
  > {
  lastProcessedAt: null | string;
  listCreatedAt: null | string;
  listUpdatedAt?: string;
}
