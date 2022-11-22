import childProcess from 'node:child_process';
import path from 'node:path';

import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import omit from 'lodash/omit';
import toString from 'lodash/toString';

import database from '../common/database';
import logToTelegram, {
  escapeTelegramMessage,
} from '../common/log-to-telegram';
import logger from '../common/logger';

// import generateTopList from './generate-top-list';
import getTags from './get-tags';
// import saveTagsIndex from './save-tags-index';
import saveToAlgolia from './save-to-algolia';

// eslint-disable-next-line unicorn/prefer-module
const ROOT_FOLDER = path.resolve(path.join(__dirname, '..', '..', '..'));
const SITE_FOLDER = path.resolve(path.join(ROOT_FOLDER, 'site4'));

// const PRODUCTION_TAGS_LIMIT = 1500;
// const DEV_TAGS_LIMIT = 1700;

async function execute(command: string): Promise<void> {
  logger.debug(command);
  const statusCode = await new Promise<number>((resolve, reject) => {
    const process = childProcess.exec(command);
    process.on('error', reject);
    process.on('close', resolve);
    process.stdout?.on?.('data', (data) => logger.debug(data));
    process.stderr?.on?.('data', (data) => logger.warn(data));
  });

  if (statusCode) {
    throw new Error('Failure');
  }
}

async function run() {
  try {
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
    await execute(`cd ${SITE_FOLDER} && yarn build`);
    logger.debug(
      `SKIP_DEPLOY: ${typeof process.env.SKIP_DEPLOY} ${
        process.env.SKIP_DEPLOY
      }`,
    );
    if (!process.env.SKIP_DEPLOY || process.env.SKIP_DEPLOY === 'false') {
      await execute(`cd ${ROOT_FOLDER} && firebase deploy --only hosting`);
    }
    logger.info('Deploy successful');
    await database.end();
    await logToTelegram(
      escapeTelegramMessage(
        `#deploy\nОновлений вебсайт – оприлюднено! Біжіть дивитися: https://you-must-hear.web.app/`,
      ),
    );
    process.exit(0);
  } catch (error: any) {
    // eslint-disable-next-line no-magic-numbers
    logger.error(`FAILURE EXIT REASON: ${toString(error)}`);
    if (error?.transporterStackTrace) {
      logger.error(get(error, 'transporterStackTrace[0].host'));
      logger.error(get(error, 'transporterStackTrace[0].request'));
    }
    await database.end();
    await logToTelegram(
      `\\#error\nНевдача в роботі deploy: ${toString(error)}`,
    );
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await logToTelegram(
    `\\#error\nНевідовлений виняток при роботі deploy: ${toString(error)}`,
  );
  await database.end();
  process.exit(1);
});

run();
