import childProcess from 'child_process';
import path from 'path';

import toString from 'lodash/toString';

import database from '../common/database';
import logger from '../common/logger';

import generateTopList from './generate-top-list';
import saveTags from './save-tags';

const ROOT_FOLDER = path.resolve(path.join(__dirname, '..', '..', '..'));
const SITE_FOLDER = path.resolve(path.join(ROOT_FOLDER, 'site'));

const PRODUCTION_TAGS_LIMIT = 1000;
const DEV_TAGS_LIMIT = 1700;

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
    await saveTags(DEV_TAGS_LIMIT);
    await saveTags(PRODUCTION_TAGS_LIMIT);
    await generateTopList();
    // await execute(`cd ${ROOT_FOLDER} && npx eslint site --fix`);
    if (!process.env.SKIP_DEPLOY) {
      await execute(`cd ${SITE_FOLDER} && yarn deploy`);
    }
    logger.info('Deploy successful');
    await database.end();
    process.exit(0);
  } catch (error) {
    logger.error(toString(error));
    await database.end();
    process.exit(1);
  }
}
process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await database.end();
  process.exit(1);
});

run();
