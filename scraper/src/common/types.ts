export type AlbumAmqpPayload = Pick<Album, 'artist' | 'mbid' | 'name'>;

/**
 * Model Album
 */

export type Album = {
  artist: string;
  cover: string | null;
  date: string | null;
  duration: number | null;
  hidden: boolean | null;
  listeners: number | null;
  mbid: string | null;
  name: string;
  numberOfTracks: number | null;
  playcount: number | null;
  registeredAt: Date;
  statsUpdatedAt?: Date;
  tagsUpdatedAt?: Date;
  thumbnail: string | null;
};

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
 * Model Tag
 */

export type Tag = {
  albumsScrapedAt?: Date;
  listCheckedAt?: Date;
  listUpdatedAt?: Date;
  name: string;
  registeredAt: Date;
};

/**
 * Model TagListItem
 */

export type TagListItem = {
  albumArtist: string;
  albumName: string;
  place: number;
  tagName: string;
  updatedAt: Date;
};

export type Weighted<T> = T & {
  weight: number;
};

export interface TagPayload extends Weighted<Tag> {
  list: (TagListItem & {
    album: Album & {
      places: TagListItem[];
      tags: AlbumTag[];
    };
  })[];
}

export interface AlbumPayload extends Weighted<Album> {
  places: TagListItem[];
  tags: AlbumTag[];
}
