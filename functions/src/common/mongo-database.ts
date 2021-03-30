import { Collection, Db, MongoClient, WithId } from 'mongodb';

import { MONGODB_DATABASE, MONGODB_URI } from './environment';
import logger from './logger';
import { AlbumRecord, TagRecord } from './types';

class MongoDatabase {
  private client: MongoClient;

  constructor() {
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is required');
    }
    this.client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  get albums(): Collection<WithId<AlbumRecord>> {
    return this.database.collection<WithId<AlbumRecord>>('albums');
  }

  connect(): Promise<MongoClient> {
    logger.debug('mongodb.connect()');
    return this.client.connect();
  }

  private get database(): Db {
    return this.client.db(MONGODB_DATABASE);
  }

  get isConnected(): boolean {
    return this.client.isConnected();
  }

  get tags(): Collection<WithId<TagRecord>> {
    return this.database.collection<WithId<TagRecord>>('tags');
  }
}

export default new MongoDatabase();
