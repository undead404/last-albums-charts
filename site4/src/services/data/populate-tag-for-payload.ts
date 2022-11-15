import SQL from '@nearform/sql';
import find from 'lodash/find';
import head from 'lodash/head';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import type {
  Album,
  AlbumTag,
  Tag,
  TagListItem,
  TagPayload,
  Weighted,
} from '../../types';
import formatAlbum from '../../utils/format-album';
import sequentialAsyncMap from '../../utils/sequential-async-map';
import logger from '../logger';

import database from './database';

export default async function populateTagForPayload(
  tag: Weighted<Tag>,
): Promise<TagPayload> {
  logger.debug(`populateTagForPayload(${tag.name})`);
  const populatedTag: TagPayload = {
    ...tag,
    list: await sequentialAsyncMap<TagListItem, TagPayload['list'][0]>(
      (
        await database.query<TagListItem>(SQL`
        SELECT *
        FROM "TagListItem"
        WHERE "tagName" = ${tag.name}
        ORDER BY "place" ASC`)
      ).rows,
      async (tagListItem) => {
        const basicAlbum = head(
          (
            await database.query<Album>(SQL`
            SELECT *
            FROM "Album"
            WHERE "artist" = ${tagListItem.albumArtist}
            AND "name" = ${tagListItem.albumName}
            LIMIT 1`)
          ).rows,
        );
        if (!basicAlbum) {
          throw new Error('Album mysteriously disappeared');
        }
        return {
          ...tagListItem,
          album: {
            ...basicAlbum,
            places: reduce(
              (
                await database.query<TagListItem>(SQL`
                  SELECT *
                  FROM "TagListItem"
                  WHERE "albumArtist" = ${tagListItem.albumArtist} AND
                    "albumName" = ${tagListItem.albumName}
                  ORDER BY "place" ASC
              `)
              ).rows,
              (placesMap, place) => ({
                ...placesMap,
                [place.tagName]: place.place,
              }),
              {},
            ),
            tags: reduce(
              (
                await database.query<AlbumTag>(SQL`
                  SELECT *
                  FROM "AlbumTag"
                  WHERE "albumArtist" = ${tagListItem.albumArtist} AND
                    "albumName" = ${tagListItem.albumName}
                  ORDER BY "count" DESC
                `)
              ).rows,
              (tagsMap, tagItem) => ({
                ...tagsMap,
                [tagItem.tagName]: tagItem.count,
              }),
              {},
            ),
          },
        };
      },
    ),
  };
  const tagAlbumWithPreview = find(
    sortBy(populatedTag.list, ['place']),
    'album.cover',
  );
  if (tagAlbumWithPreview?.album?.cover) {
    populatedTag.preview = tagAlbumWithPreview.album.cover;
    populatedTag.title = formatAlbum(tagAlbumWithPreview.album);
  }
  return populatedTag;
}
