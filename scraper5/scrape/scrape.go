package scrape

import (
	"fmt"
	"lac/scraper5/database"
	"lac/scraper5/services"
	"lac/scraper5/utils"
	"lac/scraper5/utils/blacklist"
	"lac/scraper5/utils/data"
	"log"
)

func scrape() {
	tag := pickTag()
	if tag == nil {
		log.Println("No tags to scrape")
		return
	}
	if blacklist.IsTagBlacklisted(tag.Name) {
		data.DeleteTag(tag.Name)
		log.Println("Tag", tag.Name, "is blacklisted, deleting it")
		scrape()
	}
	scrapeAlbumsByTag(tag.Name)
	database.Database.Exec(`UPDATE "Tag"
    SET "albumsScrapedAt" = NOW()
    WHERE "name" = ?
  `, tag.Name)
	log.Println("Successfully scraped tag", tag.Name)
	services.NotifyTelegram(fmt.Sprintf(`\\#scrape\nУспішно зібрано альбоми для тега *%s*`, utils.EscapeTelegramMessage(tag.Name)))
}
