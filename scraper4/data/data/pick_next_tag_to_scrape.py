from .database import pool


def pick_next_tag_to_scrape() -> list:
    with pool.connection() as connection:
        result = connection.execute("""
      SELECT
        "Tag"."albumsScrapedAt",
        "Tag"."listCheckedAt",
        "Tag"."listUpdatedAt",
        "Tag"."name",
        "Tag"."registeredAt",
        SUM("AlbumTag"."count"::FLOAT * COALESCE("Album"."playcount", 0) / 1000000 * COALESCE("Album"."listeners", 0) / 1000)
        AS "weight"
      FROM "Tag"
      JOIN "AlbumTag"
      ON "AlbumTag"."tagName" = "Tag"."name"
      JOIN "Album"
      ON "Album"."artist" = "AlbumTag"."albumArtist"
      AND "Album"."name" = "AlbumTag"."albumName"
      AND "Album"."hidden" <> true
      WHERE "albumsScrapedAt" IS NULL
      GROUP BY "Tag"."name"
      ORDER BY "weight" DESC
      LIMIT 1
    """)
        if result.rowcount > 0:
            return result.fetchone()
        return connection.execute("""
      SELECT
        "Tag"."albumsScrapedAt",
        "Tag"."listCheckedAt",
        "Tag"."listUpdatedAt",
        "Tag"."name",
        "Tag"."registeredAt"
      FROM "Tag"
      ORDER BY "albumsScrapedAt" ASC
      LIMIT 1
    """).fetchone()
