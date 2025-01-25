package blacklist

import "lac/scraper5/utils"

var blacklistedTags []string

func init() {
	var err error
	blacklistedTags, err = utils.ReadLinesFromFile("./blacklisted-tags.txt")
	utils.HandleError(err, "utils/blacklist/isTagBlacklisted.go:init:readLines")
}

// Check if a tag is in blacklisted-tags.txt
func isTagInBlacklistedTags(tagName string) bool {
	for _, blacklistedTag := range blacklistedTags {
		if tagName == blacklistedTag {
			return true
		}
	}
	return false
}
