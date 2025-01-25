package lastfm

import (
	"errors"
	"log"
	"strings"
	"sync"
)

type Album struct {
	Artist string `json:"artist"`
	Mbid   string `json:"mbid,omitempty"`
	Name   string `json:"name"`
}

type TagGetTopAlbumsPayload struct {
	Albums struct {
		Album []*Album `json:"album"`
	} `json:"albums"`
}

type TagGetTopAlbumsParams struct {
	Method string `json:"method"`
	Page   int    `json:"page"`
	Tag    string `json:"tag"`
}

const MAX_PAGE_AVAILABLE = 200
const MAX_NAME_LENGTH = 1024

func GetTagTopAlbums(tagName string) ([]Album, error) {
	log.Println("tag.getTopAlbums(" + tagName + ")")
	if len(strings.TrimSpace(tagName)) == 0 {
		return nil, errors.New("tag name is required")
	}

	var currentPage int = 1
	var albums []Album
	var lock sync.Mutex

	for currentPage <= MAX_PAGE_AVAILABLE {
		data, err := acquire(TagGetTopAlbumsParams{
			Method: "tag.getTopAlbums",
			Page:   currentPage,
			Tag:    tagName,
		})
		if err != nil {
			return nil, err
		}

		var currentAlbums []Album
		for _, album := range data.Albums.Album {
			if album.Name == "(null)" || len(album.Name) >= MAX_NAME_LENGTH || len(album.Artist) >= MAX_NAME_LENGTH {
				continue
			}
			currentAlbums = append(currentAlbums, Album{
				Artist: album.Artist,
				Mbid:   album.Mbid,
				Name:   album.Name,
			})
		}

		if len(currentAlbums) == 0 {
			break
		}

		lock.Lock()
		albums = append(albums, currentAlbums...)
		lock.Unlock()

		currentPage += 1
	}

	return albums, nil
}

func acquire(payload TagGetTopAlbumsParams) (*TagGetTopAlbumsPayload, error) {
	// implementation of acquire function not provided in TypeScript code
	return nil, nil
}
