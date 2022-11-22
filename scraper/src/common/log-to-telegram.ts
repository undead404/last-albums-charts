import TelegramBot from 'node-telegram-bot-api';

import getAlbumTitle from './get-album-title';
import logger from './logger';
import type { Album } from './types';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = token ? new TelegramBot(token) : null;

export function escapeTelegramMessage(message: string) {
  return message
    .replaceAll('_', '\\_')
    .replaceAll('*', '\\*')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('~', '\\~')
    .replaceAll('`', '\\`')
    .replaceAll('>', '\\>')
    .replaceAll('#', '\\#')
    .replaceAll('+', '\\+')
    .replaceAll('-', '\\-')
    .replaceAll('=', '\\=')
    .replaceAll('|', '\\|')
    .replaceAll('{', '\\{')
    .replaceAll('}', '\\}')
    .replaceAll('.', '\\.')
    .replaceAll('!', '\\!');
}

export default async function logToTelegram(message: string) {
  logger.debug(`logToTelegram(${message})`);
  if (!bot) {
    logger.warn('Telegram bot is not defined');
    return;
  }
  if (!chatId) {
    logger.warn('Telegram channel is not defined');
    return;
  }
  await bot.sendMessage(chatId, message, {
    parse_mode: 'MarkdownV2',
  });
}

export async function logFreshAlbumToTelegram(album: Album, tagName: string) {
  logger.debug(
    // eslint-disable-next-line no-magic-numbers
    `logFreshAlbumToTelegram(${JSON.stringify(album, null, 2)}, ${tagName})`,
  );
  if (!bot) {
    logger.warn('Telegram bot is not defined');
    return;
  }
  if (!chatId) {
    logger.warn('Telegram channel is not defined');
    return;
  }
  const message = `\\#pearl\nСвіжа перлина в тегу [${tagName}](https://you-must-hear.web.app/tag/${encodeURIComponent(
    tagName,
  )}/) – ${
    escapeTelegramMessage(
      getAlbumTitle(album),
    ) /* .replaceAll('(', '\\(').replaceAll(')', '\\)') */
  }!`;
  await (album.cover
    ? bot.sendPhoto(chatId, album.cover, {
        caption: message,
        parse_mode: 'MarkdownV2',
      })
    : logToTelegram(message));
}
