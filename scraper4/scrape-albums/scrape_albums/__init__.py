from loguru import logger

logger.add("scrape_albums_1.log", rotation="10 MB", enqueue=True)
