import toString from 'lodash/toString';
import { Client } from 'pg';

import logger from '../logger';

const database = new Client({
  database: 'lac',
  host: 'localhost',
  password: 'lac',
  user: 'lac',
});

database.on('error', (error) => {
  logger.error(toString(error));
});

export default database;
