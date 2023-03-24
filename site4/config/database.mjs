import toString from 'lodash/toString';
import pg from 'pg';

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

database.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error(toString(error));
});

process.on('SIGTERM', async () => {
  await database.end();
});

export default database;
