import { Album } from '.prisma/client';

export type AlbumAmqpPayload = Pick<Album, 'artist' | 'mbid' | 'name'>;
