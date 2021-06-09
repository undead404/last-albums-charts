import toString from 'lodash/toString';

import logger from '../common/logger';
import prisma from '../common/prisma';

import populateTagWeight from './populate-tag-weight';

export default async function main(): Promise<void> {
  try {
    await prisma.$connect();
    await populateTagWeight();
  } finally {
    await prisma.$disconnect();
  }
}

process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await prisma.$disconnect();
  process.exit(1);
});
main();
