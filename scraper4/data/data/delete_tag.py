from .database import pool


def delete_tag(tag_name: str) -> None:
    with pool.connection() as connection:
        connection.execute("""
        DELETE FROM "Tag"
        WHERE "Tag"."name" = %s
      """, (tag_name,))
