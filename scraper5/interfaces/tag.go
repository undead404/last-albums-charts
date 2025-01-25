package interfaces

import "time"

type Tag struct {
	AlbumsScrapedAt time.Time `db:"albumsScrapedAt"`
	ListCheckedAt   time.Time `db:"listCheckedAt"`
	ListUpdatedAt   time.Time `db:"listUpdatedAt"`
	Name            string    `db:"name"`
	RegisteredAt    time.Time `db:"registeredAt"`
	Weight          float32   `db:"weight"`
}
