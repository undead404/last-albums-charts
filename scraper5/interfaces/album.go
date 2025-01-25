package interfaces

import "time"

type AlbumIdentity struct {
	Artist string `json:"artist"`
	Name   string `json:"name"`
	Mbid   string `json:"mbid"`
}
type Album struct {
	Artist         string     `json:"artist"`
	Cover          *string    `json:"cover,omitempty"`
	Date           *string    `json:"date,omitempty"`
	Hidden         *bool      `json:"hidden,omitempty"`
	Listeners      *int       `json:"listeners,omitempty"`
	Mbid           string     `json:"mbid,omitempty"`
	Name           string     `json:"name"`
	NumberOfTracks *int       `json:"numberOfTracks,omitempty"`
	Playcount      *int       `json:"playcount,omitempty"`
	RegisteredAt   time.Time  `json:"registeredAt"`
	StatsUpdatedAt *time.Time `json:"statsUpdatedAt,omitempty"`
	TagsUpdatedAt  *time.Time `json:"tagsUpdatedAt,omitempty"`
	Thumbnail      string     `json:"thumbnail,omitempty"`
}
