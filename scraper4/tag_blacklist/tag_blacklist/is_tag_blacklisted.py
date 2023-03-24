from .constants import MIN_TAG_NAME_LENGTH, MAX_TAG_NAME_LENGTH, NUMERIC_RE

with open('blacklisted_tag_endings.txt') as file:
    BLACKLISTED_TAG_ENDINGS = [line for line in (
        line.rstrip('\r\n') for line in file) if line]

with open('blacklisted_tag_starts.txt') as file:
    BLACKLISTED_TAG_STARTS = [line for line in (
        line.rstrip('\r\n') for line in file) if line]

with open('blacklisted_tag_substrings.txt') as file:
    BLACKLISTED_TAG_SUBSTRINGS = [line for line in (
        line.rstrip('\r\n') for line in file) if line]


with open('blacklisted_tags.txt') as file:
    BLACKLISTED_TAGS = [line for line in (
        line.rstrip('\r\n') for line in file) if line]


def is_tag_blacklisted(tag_name: str) -> bool:
    if len(tag_name) < MIN_TAG_NAME_LENGTH:
        return True
    if len(tag_name) > MAX_TAG_NAME_LENGTH:
        return True
    if tag_name in BLACKLISTED_TAGS:
        return True
    if any(blacklisted_tag_start for blacklisted_tag_start in BLACKLISTED_TAG_STARTS if tag_name.startswith(blacklisted_tag_start)):
        return True
    if any(blacklisted_tag_ending for blacklisted_tag_ending in BLACKLISTED_TAG_ENDINGS if tag_name.endswith(blacklisted_tag_ending)):
        return True
    if any(blacklisted_tag_substring for blacklisted_tag_substring in BLACKLISTED_TAG_SUBSTRINGS if blacklisted_tag_substring in tag_name):
        return True
    if NUMERIC_RE.match(tag_name):
        return True
    return False
