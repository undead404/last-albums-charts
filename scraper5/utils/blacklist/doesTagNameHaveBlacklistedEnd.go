package blacklist

import (
	"lac/scraper5/utils"
	"strings"
)

var blacklistedTagEnds []string

func init() {
	var err error
	blacklistedTagEnds, err = utils.ReadLinesFromFile("./blacklisted-tag-ends.txt")
	utils.HandleError(err, "utils/blacklist/doestTagNameHaveBlacklistedEnd.go:init:readLines")
}
func doesTagNameHaveBlacklistedEnd(tagName string) bool {
	for _, blacklistedTagEnd := range blacklistedTagEnds {
		if strings.HasSuffix(tagName, blacklistedTagEnd) {
			return true
		}
	}
	return false
}
