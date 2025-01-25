package blacklist

import (
	"lac/scraper5/utils"
	"strings"
)

var blacklistedTagStarts []string

func init() {
	var err error
	blacklistedTagStarts, err = utils.ReadLinesFromFile("./blacklisted-tag-starts.txt")
	utils.HandleError(err, "utils/blacklist/doesTagNameHaveBlacklistedStart.go:init:readLines")
}
func doesTagNameHaveBlacklistedStart(tagName string) bool {
	for _, blacklistedTagStart := range blacklistedTagStarts {
		if strings.HasPrefix(tagName, blacklistedTagStart) {
			return true
		}
	}
	return false
}
