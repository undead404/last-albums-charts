import { configure } from 'log4js';

import { APP_NAME } from './environment';

const environment =
  process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;

const log4js = configure({
  appenders: {
    toFile: {
      type: 'file',
      filename: `logs/${APP_NAME}.log`,
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
        environment === 'production' ? ['toConsole'] : ['toConsole', 'toFile'],
      level: environment === 'production' ? 'info' : 'debug',
    },
  },
  pm2: true,
});

const logger = log4js.getLogger();
export default logger;
