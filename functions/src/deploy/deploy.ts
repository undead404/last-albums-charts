import childProcess from 'child_process';
import path from 'path';

import toString from 'lodash/toString';

import { publish } from '../common/amqp-broker';
import logger from '../common/logger';
import mongoDatabase from '../common/mongo-database';

import generateSearchIndex from './generate-search-index';
import saveTags from './save-tags';

const ROOT_FOLDER = path.resolve(path.join(__dirname, '..', '..', '..'));

function execute(command: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const process = childProcess.exec(command);
    process.on('error', reject);
    process.on('close', resolve);
    process.stdout?.on?.('data', (data) => logger.debug(data));
    process.stderr?.on?.('data', (data) => logger.warn(data));
  });
}

async function run() {
  const start = new Date();
  try {
    if (!mongoDatabase.isConnected) {
      await mongoDatabase.connect();
    }
    await saveTags();
    await generateSearchIndex();
    await execute(`cd ${ROOT_FOLDER} && npx eslint site --fix`);
    await execute(`cd site && yarn deploy`);
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
