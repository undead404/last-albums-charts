import mongoDatabase from '../common/mongo-database';

import populateTagWeight from './populate-tag-weight';

export default async function main(): Promise<void> {
  if (!mongoDatabase.isConnected) {
    await mongoDatabase.connect();
  }
  await populateTagWeight();
}

main();
