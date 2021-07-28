import SQL from '@nearform/sql';

import database from '../common/database';
import logger from '../common/logger';
import sequentialAsyncMap from '../common/sequential-async-map';
import { Album, AlbumTag, TagListItem, Weighted } from '../common/types';

import saveTopList from './save-top-list';

const LIST_LENGTH = 100;

export default async function generateTopList(): Promise<void> {
  logger.debug('generateTopList()');
  const result = await database.query<Weighted<Album>>(SQL`
    SELECT *,
      (COALESCE("playcount", 0)::FLOAT / COALESCE("numberOfTracks", (
        SELECT AVG("numberOfTracks") FROM "Album" WHERE "numberOfTracks" IS NOT NULL
      ))) *
        COALESCE("listeners", 0) *
        (COALESCE("duration", (
          SELECT AVG("duration") FROM "Album" WHERE "duration" IS NOT NULL
        ))::FLOAT / COALESCE("numberOfTracks", (
          SELECT AVG("numberOfTracks") FROM "Album" WHERE "numberOfTracks" IS NOT NULL
        )))
      AS "weight"
    FROM "Album"
    WHERE "date" IS NOT NULL AND
      "hidden" = false
    ORDER BY "weight" DESC
    LIMIT ${LIST_LENGTH}
  `);
  const albums = await sequentialAsyncMap(result.rows, async (album) => ({
    ...album,
    places: (
      await database.query<TagListItem>(SQL`
        SELECT *
        FROM "TagListItem"
        WHERE "albumArtist" = ${album.artist} AND
          "albumName" = ${album.name}
        ORDER BY "place" ASC
      `)
    ).rows,
    tags: (
      await database.query<AlbumTag>(SQL`
        SELECT *
        FROM "AlbumTag"
        WHERE "albumArtist" = ${album.artist} AND
          "albumName" = ${album.name}
        ORDER BY "count" DESC
      `)
    ).rows,
  }));
  await saveTopList(albums);
  logger.debug('generateTopList: success');
}
