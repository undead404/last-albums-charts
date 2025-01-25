import _ from 'lodash';
import TelegramBot from 'node-telegram-bot-api';

import getAlbumTitle from './get-album-title.js';
import logger from './logger.js';
import type { Album } from './types.js';

const { truncate } = _;

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const MAX_MESSAGE_LENGTH = 4096;

const bot = token ? new TelegramBot(token) : null;

function truncateMessage(message: string) {
  return truncate(message, { length: MAX_MESSAGE_LENGTH, separator: '\n' });
}

export function escapeTelegramMessage(message: string) {
  return truncateMessage(
    message
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
      .replaceAll('!', '\\!')
      .slice(0, MAX_MESSAGE_LENGTH),
  );
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
  await bot.sendMessage(chatId, truncateMessage(message), {
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
  const message = `\\#pearl\nСвіжа перлина в тегу [${escapeTelegramMessage(
    tagName,
  )}](https://you-must-hear.web.app/tag/${encodeURIComponent(tagName)}/) – ${
    escapeTelegramMessage(
      getAlbumTitle(album),
    ) /* .replaceAll('(', '\\(').replaceAll(')', '\\)') */
  }\\!`;
  if (album.cover) {
    try {
      await bot.sendPhoto(chatId, album.cover, {
        caption: message,
        parse_mode: 'MarkdownV2',
      });
    } catch (error) {
      logger.error(error);
      await logToTelegram(message);
    }
  }
}
