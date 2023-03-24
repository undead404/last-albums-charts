// https://astro.build/config
// import image from '@astrojs/image';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import robotsTxt from 'astro-robots-txt';

import getTagLastmod from './get-tag-lastmod.mjs';

const external = [];
const noExternal = ['usehooks-ts'];

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  integrations: [
    // image({
    //   serviceEntryPoint: '@astrojs/image/sharp',
    // }),
    react(),
    robotsTxt(),
    sitemap({
      async serialize(item) {
        const relativeUrl = item.url.slice(
          'https://you-must-hear.web.app'.length,
        );
        if (relativeUrl === '' || relativeUrl === '/') {
          return {
            ...item,
            changefreq: 'daily',
            lastmod: new Date(),
            priority: 1,
          };
        }
        if (/^\/tags\/\d+\/?$/.test(relativeUrl)) {
          return {
            ...item,
            changefreq: 'daily',
            lastmod: new Date(),
            priority: 0.5,
          };
        }
        const match = /^\/tag\/(\w+)\/?$/.exec(relativeUrl);
        if (match) {
          return {
            ...item,
            changefreq: 'monthly',
            lastmod: await getTagLastmod(match[1]),
            priority: 1,
          };
        }
        if (/^\/about\/?$/.test(relativeUrl)) {
          return {
            ...item,
            changefreq: 'monthly',
            // eslint-disable-next-line no-magic-numbers
            lastmod: new Date(2022, 10, 22, 22, 19),
            priority: 1,
          };
        }
        return item;
      },
    }),
  ],
  site: 'https://you-must-hear.web.app/',
  vite: {
    ssr: {
      external,
      noExternal,
    },
  },
});
