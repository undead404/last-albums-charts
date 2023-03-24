from loguru import logger
from ..acquire import acquire

MAX_NAME_LEN = 1024
MAX_PAGE_AVAILABLE = 200


def get_tag_top_albums(tag_name: str):
    logger.debug(f'get_tag_top_albums({tag_name})')
    current_page = 1
    while current_page <= MAX_PAGE_AVAILABLE:
        data = acquire({
            "method": "tag.getTopAlbums",
            "page": current_page,
            "tag": tag_name
        })
        for top_album in data:
            if top_album['name'] != '(null)' and len(top_album['name']) <= MAX_NAME_LEN and len(top_album['artist']['name']) <= MAX_NAME_LEN:
                yield {
                    "artist": top_album['artist']['name'],
                    "mbid": top_album['mbid'],
                    "name": top_album['name']
                }
