from os import environ

from loguru import logger
from pylast import LastFMNetwork

from data import insert_album_skeleton
from lastfm_api import get_tag_top_albums

last_fm_network = LastFMNetwork(environ['LASTFM_API_KEY'], environ['LASTFM_API_KEY'])

def scrape_albums_by_tag(tag_name: str) -> None:
  logger.info(f'scrape_albums_by_tag({tag_name})')
  albums = get_tag_top_albums(tag_name)
  logger.info(f'scrapeAlbumsByTag({tag_name}): ${len(albums)} albums scraped')
  for album in albums:
    try:
      insert_album_skeleton(album)
    except Exception as error:
      logger.error(error)

