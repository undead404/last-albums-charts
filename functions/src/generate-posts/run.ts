import mongoDatabase from '../common/mongo-database';
import generatePosts from './generate-posts';

export default async function run(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  return generatePosts();
}

run();
