package blacklist

const MIN_TAG_NAME_LENGTH = 2
const MAX_TAG_NAME_LENGTH = 40

func IsTagBlacklisted(tagName string) bool {
	if len(tagName) < MIN_TAG_NAME_LENGTH {
		return true
	}
	if len(tagName) > MAX_TAG_NAME_LENGTH {
		return true
	}
	if isTagInBlacklistedTags(tagName) {
		return true
	}
	if isStringNumeric(tagName) {
		return true
	}
	if doesTagNameHaveBlacklistedEnd(tagName) {
		return true
	}
	if doesTagNameHaveBlacklistedStart(tagName) {
		return true
	}
	if doesTagNameHaveBlacklistedSubstring(tagName) {
		return true
	}
	return false
}
