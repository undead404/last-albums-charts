import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import logger from '../common/logger';
import prisma from '../common/prisma';

import saveTopList from './save-top-list';

const LIST_LENGTH = 10;

export default async function generateTopList(): Promise<void> {
  logger.debug('generateTopList()');
  const albums = await prisma.album.findMany({
    include: {
      places: true,
      tags: true,
    },
    orderBy: [
      {
        weight: 'desc',
      },
    ],
    take: LIST_LENGTH,
    where: {
      NOT: {
        date: null,
      },
      hidden: false,
    },
  });
  const albumWithoutTags = find(albums, (album) => isEmpty(album.tags));
  if (albumWithoutTags) {
    throw new Error(
      `${albumWithoutTags.artist} - ${albumWithoutTags.name} - NO TAGS`,
    );
  }
  await saveTopList(albums);
  logger.debug('generateTopList: success');
}
