import toString from 'lodash/toString';

import logger from '../common/logger';
import prisma from '../common/prisma';

import updateList from './update-list';

export default async function main(): Promise<void> {
  try {
    await prisma.$connect();
    await updateList();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error(toString(error));
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('uncaughtException', async (error) => {
  logger.error(toString(error));
  await prisma.$disconnect();
  process.exit(1);
});
main();
