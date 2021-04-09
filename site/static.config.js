import path from 'path';

import filenamify from 'filenamify';
import map from 'lodash/map';

import tagsData from './src/tags.json';
// import { Post } from './types'

const { tags } = tagsData;

// Typescript support in static.config.js is not yet supported, but is coming in a future update!

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getRoutes: async () => {
    return [
      {
        path: '/tag',
        getData: () => ({
          tags,
        }),
        template: 'src/pages/tags',
        children: map(tags, (tag /* : Post */) => ({
          path: `/${filenamify(tag.name)}`,
          template: 'src/pages/tag',
          getData: () => ({
            tag,
          }),
        })),
      },
    ];
  },
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
};
