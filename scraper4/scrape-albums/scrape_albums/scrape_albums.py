from loguru import logger
from data import delete_tag, pick_next_tag_to_scrape, save_tag_scrape_success
from tag_blacklist import is_tag_blacklisted
from telegram_logger import log_to_telegram

from .remove_tag_duplicates import remove_tag_duplicates

@logger.catch
def scrape_albums():
    logger.debug('scrape_albums()')
    tag = pick_next_tag_to_scrape()
    if tag is None:
        logger.error('Failed to find a tag to scrape albums by')
        return
    if is_tag_blacklisted(tag):
        delete_tag(tag)
        scrape_albums()
        return
    removed_duplicates = remove_tag_duplicates(tag['name'])
    if tag['name'] in removed_duplicates:
        logger.warning(f'{tag["name"]} - removed as a duplicate')
        scrape_albums()
        return
    scrape_albums_by_tag(tag)
    save_tag_scrape_success(tag['name'])
    logger.debug(f'scrapeAlbums: {tag["name"]} - success')
    log_to_telegram(fr'\\#scrape\\_albums\nУспішно зібрано альбоми для тега *{tag.name}*')
