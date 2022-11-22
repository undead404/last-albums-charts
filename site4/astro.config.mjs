// https://astro.build/config
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

const external = ['brain.js'];
const noExternal = ['brain.js', 'usehooks-ts'];
if (process.env.NODE_ENV !== 'development') {
  noExternal.push('brain.js');
  // } else {
  //   external.push('brain.js');
}

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    ssr: {
      external,
      noExternal,
    },
  },
});
