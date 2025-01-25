import path from 'node:path';

import _ from 'lodash';

import database from '../common/database/index.js';
import logToTelegram, {
  escapeTelegramMessage,
} from '../common/log-to-telegram.js';
import logger from '../common/logger.js';

// import generateTopList from './generate-top-list.js';
import getTags from './get-tags.js';
// import saveTagsIndex from './save-tags-index.js';
import saveToAlgolia from './save-to-algolia.js';
import execute from '../common/execute.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import formatError from '../common/format-error.js';

const { find, get, map, omit } = _;
const directory = dirname(fileURLToPath(import.meta.url));

const ROOT_FOLDER = path.resolve(path.join(directory, '..', '..', '..'));
const SITE_FOLDER = path.resolve(path.join(ROOT_FOLDER, 'site4'));

// const PRODUCTION_TAGS_LIMIT = 1500;
// const DEV_TAGS_LIMIT = 1700;

async function run() {
  try {
    await execute(`cd ${SITE_FOLDER} && yarn build`);
    await database.connect();
    // await removeTagDuplicates();
    // await saveTags(DEV_TAGS_LIMIT);
    // await saveTags(PRODUCTION_TAGS_LIMIT);
    // await saveToFirestore();
    const tags = await getTags();
    // await saveTags(tags);
    const tagsForTagsPage = map(tags, (tag) => {
      const albumWithCover = find(tag.list, 'album.thumbnail')?.album;
      return {
        ...omit(tag, ['albums', 'list', 'registeredAt']),
        preview: albumWithCover?.thumbnail,
        title: albumWithCover
          ? `${albumWithCover.artist} - ${albumWithCover.name} (${albumWithCover.date})`
          : undefined,
        albums: map(
          tag.list,
          (album) => `${album.albumArtist} – ${album.albumName}`,
        ),
        // list: undefined,
        objectID: tag.name,
      };
    });
    await saveToAlgolia(tagsForTagsPage);
    // await saveTagsIndex(tagsForTagsPage);
    // await generateTopList();
    // await execute(
    //   `cd ${ROOT_FOLDER} && npx eslint  'site4/**/*.{ts,tsx,astro}' --fix`,
    // );
    logger.info('Build successful');
    await database.end();
    await logToTelegram(
      escapeTelegramMessage(`#build\nЗбирання вебсайту завершено.`),
    );
    process.exit(0);
  } catch (error: any) {
    // eslint-disable-next-line no-magic-numbers
    logger.error(`FAILURE EXIT REASON: ${formatError(error)}`);
    if (error?.transporterStackTrace) {
      logger.error(get(error, 'transporterStackTrace[0].host'));
      logger.error(get(error, 'transporterStackTrace[0].request'));
    }
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі build: ${escapeTelegramMessage(
        formatError(error),
      )}`,
    );
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(formatError(error));
  await logToTelegram(
    `\\#error\nНевідовлений виняток при роботі build: ${formatError(error)}`,
  );
  await database.end();
  process.exit(1);
});

run();
