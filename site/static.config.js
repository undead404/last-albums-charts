import path from 'path';

import filenamify from 'filenamify';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import omit from 'lodash/omit';
import orderBy from 'lodash/orderBy';
import { createSharedData } from 'react-static/node';

import searchIndex from './src/search-index.json';
import tagsData from './src/tags.json';
// import { Tag } from './types'

const { tags } = tagsData;

const tagsWithRankedAlbums = map(tags, (tag) => {
  const albumsByWeight = orderBy(tag.topAlbums, ['weight'], ['desc']);
  return {
    ...tag,
    topAlbums: map(tag.topAlbums, (album) => ({
      ...omit(album, ['_id']),
      rating:
        findIndex(albumsByWeight, { artist: album.artist, name: album.name }) +
        1,
    })),
  };
});

const availableTags = map(tags, 'name');

// Typescript support in static.config.js is not yet supported, but is coming in a future update!

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getRoutes: async () => {
    const sharedAvailableTags = createSharedData(availableTags);
    return [
      {
        children: map(tagsWithRankedAlbums, (tag /* : Post */) => ({
          path: `/${filenamify(tag.name)}`,
          template: 'src/pages/tag',
          getData: () => ({
            availableTags: sharedAvailableTags,
            tag,
          }),
        })),
        getData: async () => ({
          searchIndex,
          tags: tagsWithRankedAlbums,
        }),
        path: '/tag',
        template: 'src/pages/tags',
      },
      {
        getData: async () => ({
          availableTags: sharedAvailableTags,
        }),
        path: '/tag-list',
        template: 'src/pages/tags-list',
      },
    ];
  },
  outputFileRate: 20,
  plugins: [
    'react-static-plugin-typescript',
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
  siteRoot: 'https://you-must-hear.surge.sh',
};
