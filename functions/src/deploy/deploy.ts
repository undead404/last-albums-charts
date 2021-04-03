import childProcess from 'child_process';
import path from 'path';

import toString from 'lodash/toString';

import logger from '../common/logger';
import { publish } from '../common/amqp-broker';

const SSG_FOLDER = path.resolve(path.join(__dirname, '..', '..', '..', 'ssg'));
logger.debug(SSG_FOLDER);

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
    await execute(`git add ${SSG_FOLDER}`);
    const diffReturnCode = await execute('git diff --cached --exit-code');
    if (diffReturnCode === 0) {
      logger.info('No changes yet.');
    } else {
      await execute(`git commit -m "deploy ${new Date().toString()}"`);
      await execute('git push');
      logger.info('deploy successful');
    }
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
