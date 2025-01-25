import pg from 'pg';

import formatError from '../format-error.js';
import logger from '../logger.js';

const database = new pg.Client({
  database: 'lac',
  host: 'localhost',
  password: 'lac',
  user: 'lac',
});

database.on('error', (error) => {
  logger.error(formatError(error));
});

export default database;
