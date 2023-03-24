from .database import pool


def save_tag_scrape_success(tag_name: str) -> None:
    with pool.connection() as connection:
        connection.execute("""
          UPDATE "Tag"
          SET "albumsScrapedAt" = NOW()
          WHERE "name" = %s
        """, (tag_name,))
