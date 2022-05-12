import { readFile } from 'fs';

import logger from './logger';

export default function openData(name: string): Promise<unknown> {
  logger.debug(`openData(${name})`);
  return new Promise((resolve, reject) => {
    readFile(`data/${name}.json`, 'utf8', (readError, content) => {
      if (readError) {
        reject(readError);
      } else {
        try {
          resolve(JSON.parse(content));
        } catch (jsonError) {
          reject(jsonError);
        }
      }
    });
  });
}
