import re

from .database import pool


def get_tag_duplicates(tag_name: str) -> list[str]:
    with pool.connection() as connection:
        result = connection.execute("""
      SELECT "weighted_tags"."name" AS "name"
      FROM (
        SELECT
          "Tag"."albumsScrapedAt",
          "Tag"."listCheckedAt",
          "Tag"."listUpdatedAt",
          "Tag"."name",
          "Tag"."registeredAt",
          SUM(
            "AlbumTag"."count" :: FLOAT * COALESCE("Album"."playcount", 0) / 1000000 * COALESCE("Album"."listeners", 0) / 1000
          ) AS "weight"
        FROM "Tag"
        JOIN "AlbumTag" ON "AlbumTag"."tagName" = "Tag"."name"
        JOIN "Album" ON "Album"."artist" = "AlbumTag"."albumArtist"
        AND "Album"."name" = "AlbumTag"."albumName"
        WHERE
          REGEXP_REPLACE("Tag"."name", '\\W+', '', 'g') = %s
        GROUP BY "Tag"."name"
        ORDER BY "weight" DESC
      ) AS "weighted_tags" OFFSET 1
    """, (re.sub(r'[^\da-z]', '', tag_name),)).fetchall()
        return map(lambda record: record['name'], result)
