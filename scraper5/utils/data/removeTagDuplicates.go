package data

import (
	"lac/scraper5/database"
	"lac/scraper5/utils"
	"log"
)

func RemoveTagDuplicates(tagName string) {
	rows, err := database.Database.Query(`SELECT "weighted_tags"."name" AS "name"
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
      REGEXP_REPLACE("Tag"."name", '\\W+', '', 'g') = $1
    GROUP BY "Tag"."name"
    ORDER BY "weight" DESC
  ) AS "weighted_tags" OFFSET 1`, utils.RejectNonAlphanumeric(tagName))
	utils.HandleError(err, "utils/data/removeTagDuplicates.go:RemoveTagDuplicates:query")
	defer rows.Close()
	tagNamesToRemove := []string{}
	for rows.Next() {
		var tagNameToRemove string
		err = rows.Scan(&tagNameToRemove)
		utils.HandleError(err, "utils/data/removeTagDuplicates.go:RemoveTagDuplicates:scan")
		tagNamesToRemove = append(tagNamesToRemove, tagNameToRemove)
	}
	for _, tagNameToRemove := range tagNamesToRemove {
		log.Printf("Removing duplicate tag %s; primary tag %s", tagNameToRemove, tagName)
		DeleteTag(tagNameToRemove)
	}
}
