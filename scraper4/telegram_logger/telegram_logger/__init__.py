from os import environ

from dotenv import load_dotenv
from loguru import logger
from telebot import TeleBot

from .escape_message import escape_message

load_dotenv()

logger.add("telegram_logger_1.log", rotation="10 MB", enqueue=True)

bot = TeleBot(environ['TELEGRAM_BOT_TOKEN'], parse_mode='MarkdownV2')

def log_to_telegram(message: str) -> None:
  logger.debug(f'log_to_telegram({message})')
  bot.send_message(environ['TELEGRAM_CHAT_ID'], message)
