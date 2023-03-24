import { exec } from 'node:child_process';

import logger from './logger.js';

export default async function execute(command: string): Promise<void> {
  logger.debug(command);
  const statusCode = await new Promise<number>((resolve, reject) => {
    const process = exec(command);
    process.on('error', reject);
    process.on('close', resolve);
    process.stdout?.on?.('data', (data) => logger.debug(data));
    process.stderr?.on?.('data', (data) => logger.warn(data));
  });

  if (statusCode) {
    throw new Error('Failure');
  }
}
