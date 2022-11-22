import log4js from 'log4js';

const instance = log4js.configure({
  appenders: {
    toFile: {
      type: 'file',
      filename: `logs/you-must-hear.log`,
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
      appenders: import.meta.env.PROD ? ['toConsole'] : ['toConsole', 'toFile'],
      level: import.meta.env.PROD ? 'info' : 'debug',
    },
  },
  pm2: true,
});

const logger = instance.getLogger();
export default logger;
