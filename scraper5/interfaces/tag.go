package interfaces

import "time"

type Tag struct {
	AlbumsScrapedAt time.Time
	ListCheckedAt   time.Time
	ListUpdatedAt   time.Time
	Name            string
	RegisteredAt    time.Time
	Weight          float32
}
