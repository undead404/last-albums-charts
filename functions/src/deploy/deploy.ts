import childProcess from 'child_process';
import path from 'path';

import toString from 'lodash/toString';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import generateSearchIndex from './generate-search-index';
import saveTags from './save-tags';
import generateTopList from './generate-top-list';

const ROOT_FOLDER = path.resolve(path.join(__dirname, '..', '..', '..'));
const SITE_FOLDER = path.resolve(path.join(ROOT_FOLDER, 'site'));

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
  const start = new Date();
  try {
    if (!mongoDatabase.isConnected) {
      await mongoDatabase.connect();
    }
    await saveTags();
    await generateSearchIndex();
    await generateTopList();
    await execute(`cd ${ROOT_FOLDER} && npx eslint site --fix`);
    await execute(`cd ${SITE_FOLDER} && yarn deploy`);
    logger.info('Deploy successful');
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: true,
      targetName: 'site',
      title: 'deploy',
    });
  } catch (error) {
    logger.error(toString(error));
    await publish('perf', {
      end: new Date().toISOString(),
      start: start.toISOString(),
      success: false,
      targetName: 'site',
      title: 'deploy',
    });
  }
}

run();
