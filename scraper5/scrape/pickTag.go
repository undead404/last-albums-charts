package scrape

import (
	"database/sql"
	"lac/scraper5/database"
	"lac/scraper5/interfaces"
	"lac/scraper5/utils"
)

func pickTag() *interfaces.Tag {
	var tag interfaces.Tag
	row := database.Database.QueryRow(`SELECT
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
    LIMIT 1`)
	err := row.Scan(&tag.AlbumsScrapedAt, &tag.ListCheckedAt, &tag.ListUpdatedAt, &tag.Name, &tag.RegisteredAt)
	switch err {
	case nil:
		return &tag
	case sql.ErrNoRows:
		// Go to next step
	default:
		utils.HandleError(err)
	}
	row = database.Database.QueryRow(`SELECT
    "Tag"."albumsScrapedAt",
    "Tag"."listCheckedAt",
    "Tag"."listUpdatedAt",
    "Tag"."name",
    "Tag"."registeredAt"
    FROM "Tag"
    ORDER BY "albumsScrapedAt" ASC
    LIMIT 1`)
	err = row.Scan(&tag.AlbumsScrapedAt, &tag.ListCheckedAt, &tag.ListUpdatedAt, &tag.Name, &tag.RegisteredAt)
	switch err {
	case nil:
		return &tag
	case sql.ErrNoRows:
		return nil
	default:
		utils.HandleError(err)
	}
	return nil
}
