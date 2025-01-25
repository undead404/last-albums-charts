package scrape

import (
	"fmt"
	"lac/scraper5/database"
	"lac/scraper5/services/lastfm"
	"log"
)

func scrapeAlbumsByTag(tagName string) {
	log.Println("Scraping tag", tagName)
	albumIdentities := lastfm.GetTagTopAlbums(tagName)
	// albums := make([]interfaces.Album, len(albumIdentities))
	// for i, albumIdentity := range albumIdentities {
	// 	albums[i] = interfaces.Album{
	// 		Artist: albumIdentity.Artist,
	// 		Name:   albumIdentity.Name,
	// 		Mbid:   albumIdentity.Mbid,
	// 	}
	// }
	log.Println(fmt.Sprintf(`scrapeAlbumsByTag(%s): %d albums scraped`, tagName, len(albumIdentities)))
	for _, albumIdentity := range albumIdentities {
		database.Database.Exec(`
      INSERT INTO "Album"("artist", "mbid", "name")
      VALUES(?, ?, ?)
      ON CONFLICT("artist", "name")
      DO NOTHING
    `, albumIdentity.Artist, albumIdentity.Mbid, albumIdentity.Name)
		populateAlbumStats(albumIdentity)
		populateAlbumTags(albumIdentity)
	}
}
