import toString from 'lodash/toString';
import pg from 'pg';

import logger from '../logger';

const database = new pg.Client({
  database: 'lac',
  host: 'localhost',
  password: 'lac',
  user: 'lac',
});

const isConnectedWaiter = database.connect();

export async function initDatabase() {
  await isConnectedWaiter;
}

database.on('error', (error: unknown) => {
  logger.error(
    toString((error as any)?.message || (error as any)?.code || error),
  );
});

process.on('SIGTERM', async () => {
  await database.end();
});

export default database;
