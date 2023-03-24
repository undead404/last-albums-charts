

from .database import pool


def insert_album_skeleton(album):
    with pool.connection() as connection:
        connection.execute("""
        INSERT INTO "Album"("artist", "mbid", "name")
          VALUES(%s, %s, %s)
          ON CONFLICT("artist", "name")
          DO NOTHING
      """, (album["artist"], album["mbid"], album['name']))
