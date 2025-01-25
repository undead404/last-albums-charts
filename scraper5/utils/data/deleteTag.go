package data

import (
	"lac/scraper5/database"
	"lac/scraper5/utils"
)

func DeleteTag(tagName string) {
	_, err := database.Database.Exec(`DELETE FROM "Tag" WHERE "name" = $1`, tagName)
	utils.HandleError(err, "utils/deleteTag.go:DeleteTag")
}
