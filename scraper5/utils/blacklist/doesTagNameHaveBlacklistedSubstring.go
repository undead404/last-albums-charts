package blacklist

import "strings"

var BLACKLISTED_SUBSTRINGS = [...]string{".", "/", " - ", ":", "  ", "lastfm"}

func doesTagNameHaveBlacklistedSubstring(tagName string) bool {
	for _, blacklistedSubstring := range BLACKLISTED_SUBSTRINGS {
		if strings.Contains(tagName, blacklistedSubstring) {
			return true
		}
	}
	return false
}
