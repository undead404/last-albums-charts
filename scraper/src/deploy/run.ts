import { constants } from 'node:fs';
import { access, writeFile } from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import _ from 'lodash';

import execute from '../common/execute.js';
import logToTelegram, {
  escapeTelegramMessage,
} from '../common/log-to-telegram.js';
import logger from '../common/logger.js';

const { get, toString } = _;
const directory = dirname(fileURLToPath(import.meta.url));
const ROOT_FOLDER = path.resolve(path.join(directory, '..', '..', '..'));
const DIST_FOLDER = path.join(ROOT_FOLDER, 'site4', 'dist');
const BUILD_SUCCESS_MARKER_FILE_PATH = path.join(
  DIST_FOLDER,
  'success-marker.txt',
);
const DEPLOY_SUCCESS_MARKER_FILE_PATH = path.join(
  DIST_FOLDER,
  'deploy-success-marker.txt',
);

export default async function run() {
  logger.debug('deploy2.run()');
  try {
    try {
      await access(DEPLOY_SUCCESS_MARKER_FILE_PATH, constants.F_OK);
      throw new Error('Old build found');
      // eslint-disable-next-line no-empty
    } catch {}
    try {
      await access(BUILD_SUCCESS_MARKER_FILE_PATH, constants.F_OK);
    } catch {
      logger.debug('No build to deploy');
      return;
    }
    logger.info('Build exists. Deploying...');
    await execute(`cd ${ROOT_FOLDER} && firebase deploy --only hosting`);

    logger.info('Deploy successful');
    await logToTelegram(
      escapeTelegramMessage(
        `#deploy\nОновлений вебсайт – оприлюднено! Біжіть дивитися: https://you-must-hear.web.app/`,
      ),
    );
    await writeFile(DEPLOY_SUCCESS_MARKER_FILE_PATH, '');
    await execute(`rm -rf "${DIST_FOLDER}"`);
    process.exit(0);
  } catch (error: any) {
    // eslint-disable-next-line no-magic-numbers
    logger.error(`FAILURE EXIT REASON: ${toString(error)}`);
    if (error?.transporterStackTrace) {
      logger.error(get(error, 'transporterStackTrace[0].host'));
      logger.error(get(error, 'transporterStackTrace[0].request'));
    }
    await logToTelegram(
      `\\#error\nНевдача в роботі deploy2: ${escapeTelegramMessage(
        toString(error),
      )}`,
    );
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await logToTelegram(
    `\\#error\nНевідовлений виняток при роботі deploy2: ${toString(error)}`,
  );
  process.exit(1);
});

run();
