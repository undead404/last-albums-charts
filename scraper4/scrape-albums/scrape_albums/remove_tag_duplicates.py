from data import delete_tag, get_tag_duplicates


def remove_tag_duplicates(tag_name: str) -> list[str]:
    tag_duplicate_names = get_tag_duplicates(tag_name)
    for tag_duplicate_name in tag_duplicate_names:
        delete_tag(tag_duplicate_name)
    return tag_duplicate_names
