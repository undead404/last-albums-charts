export interface Album {
  artist: string;
  cover?: null | string;
  date?: null | string;
  duration: number | null;
  listeners: number | null;
  mbid: string | null;
  name: string;
  numberOfTracks: number | null;
  places: { [tagName: string]: number };
  playcount: number | null;
  rating: number;
  tags: { [name: string]: number } | null;
  thumbnail?: null | string;
  weight: number;
}

export interface Tag {
  albumsScrapedAt: Date | null;
  listCheckedAt: Date | null;
  listUpdatedAt: Date | null;
  name: string;
  weight: number;
  trainingModel?: unknown;
}

export interface SerializedTag
  extends Omit<Tag, 'albumsScrapedAt' | 'listCheckedAt' | 'listUpdatedAt'> {
  albumsScrapedAt: null | string;
  listCheckedAt: null | string;
  listUpdatedAt: string | null;
}

export type TagForTagsPage = Omit<SerializedTag, 'topAlbums'> & {
  preview: string;
  title: string;
};

export interface SerializedTagForTagsPage
  extends Omit<
    TagForTagsPage,
    'albumsScrapedAt' | 'listCheckedAt' | 'listUpdatedAt'
  > {
  albumsScrapedAt: null | string;
  listCheckedAt: null | string;
  listUpdatedAt: null | string;
}

/**
 * Model AlbumTag
 */

export type AlbumTag = {
  albumArtist: string;
  albumName: string;
  tagName: string;
  count: number;
};

/**
 * Model TagListItem
 */

export type TagListItem = {
  albumArtist: string;
  albumName: string;
  place: number;
  tagName: string;
  updatedAt: string;
};

export type Weighted<T> = T & {
  weight: number;
};

export interface TagPayload extends Weighted<Tag> {
  list: (TagListItem & {
    album: Album & {
      places: Record<string, number>;
      tags: Record<string, number>;
    };
  })[];
  preview?: string;
  title?: string;
}
