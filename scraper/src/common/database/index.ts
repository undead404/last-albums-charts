import _ from 'lodash';
import pg from 'pg';

import logger from '../logger.js';

const { toString } = _;

const database = new pg.Client({
  database: 'lac',
  host: 'localhost',
  password: 'lac',
  user: 'lac',
});

database.on('error', (error) => {
  logger.error(toString(error));
});

export default database;
