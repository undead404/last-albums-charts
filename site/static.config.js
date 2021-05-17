import path from 'path';

import filenamify from 'filenamify';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import omit from 'lodash/omit';
import orderBy from 'lodash/orderBy';
import { createSharedData } from 'react-static/node';

import searchIndex from './src/search-index.json';
import tagsData from './src/tags.json';
import topList from './src/top-list.json';
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
        children: [
          {
            children: map(tagsWithRankedAlbums, (tag /* : Post */) => ({
              path: `/${filenamify(tag.name)}`,
              template: 'src/pages/tag/tag',
              getData: () => ({
                availableTags: sharedAvailableTags,
                tag,
              }),
            })),
            getData: async () => ({
              searchIndex,
              tags: map(tagsWithRankedAlbums, (tag) => {
                const albumWithCover = find(orderBy(tag.topAlbums, ['weight'], ['desc']), 'thumbnail');
                return {
                  ...omit(tag, ['_id', 'topAlbums']),
                  preview: albumWithCover?.thumbnail,
                  title: albumWithCover
                    ? `${albumWithCover.artist} - ${albumWithCover.name} (${albumWithCover.date})`
                    : undefined,
                };
              }),
            }),
            path: '/tag',
            template: 'src/pages/tags/tags',
          },
          {
            getData: async () => ({
              availableTags: sharedAvailableTags,
            }),
            path: '/tag-list',
            template: 'src/pages/tags-list',
          },
          {
            path: '/404',
            template: 'src/pages/404',
          },
          {
            path: '/about',
            template: 'src/pages/about',
          },
        ],
        getData: () => ({
          availableTags: sharedAvailableTags,
          topList: topList.albums,
        }),
        path: '/',
        template: 'src/pages/index/index',
      },
    ];
  },
  outputFileRate: 20,
  plugins: [
    'react-static-plugin-typescript',
    // [
    //   require.resolve('react-static-plugin-source-filesystem'),
    //   {
    //     location: path.resolve('./src/pages'),
    //   },
    // ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
    require.resolve('react-static-plugin-styled-components'),
  ],
  siteRoot: 'https://you-must-hear.surge.sh',
};
