import { Logger } from 'effect';
import log4js from 'log4js';

import environment from './environment.js';

const log4jsConfigured = log4js.configure({
  appenders: {
    toFile: {
      type: 'file',
      filename: `logs/${environment.APP_NAME}.log`,
      maxLogSize: 10_485_760,
      backups: 3,
      keepFileExt: true,
    },
    toConsole: {
      type: 'console',
    },
  },
  categories: {
    default: {
      appenders:
        environment.NODE_ENV === 'production'
          ? ['toConsole']
          : ['toConsole', 'toFile'],
      level: environment.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  },
  pm2: true,
});

const log4jsLogger = log4jsConfigured.getLogger();

const logger = Logger.make(({ logLevel, message }) => {
  // eslint-disable-next-line no-underscore-dangle
  log4jsLogger.log(logLevel._tag, message);
});

export default logger;
