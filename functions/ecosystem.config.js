// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies,node/no-unpublished-require
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  apps: [
    {
      autorestart: false,
      cron_restart: '45 * * * *',
      instances: 1,
      name: 'deploy',
      script: '../deploy.sh',
      watch: false,
    },
    {
      autorestart: true,
      cron_restart: '0/15 * * * *',
      instances: 1,
      name: 'gList',
      script: 'lib/generate-list/run.js',
      watch: false,
    },
    // {
    //   autorestart: false,
    //   cron_restart: '30 * * * *',
    //   instances: 1,
    //   name: 'hexo',
    //   script: 'cd ../ssg && yarn build; cd ../functions',
    //   watch: false,
    // },
    {
      cron_restart: '5 * * * *',
      instances: 1,
      name: 'paCover',
      restart_delay: 200,
      script: 'lib/populate-album-cover/run.js',
      watch: false,
    },
    {
      cron_restart: '10 * * * *',
      instances: 1,
      name: 'paDate',
      restart_delay: 200,
      script: 'lib/populate-album-date/run.js',
      watch: false,
    },
    {
      cron_restart: '15 * * * *',
      instances: 1,
      name: 'paStats',
      restart_delay: 200,
      script: 'lib/populate-album-stats/run.js',
      watch: false,
    },
    {
      cron_restart: '20 * * * *',
      instances: 1,
      name: 'paTags',
      restart_delay: 200,
      script: 'lib/populate-album-tags/run.js',
      watch: false,
    },
    {
      cron_restart: '25 * * * *',
      instances: 1,
      name: 'ptWeight',
      script: 'lib/populate-tag-weight/run.js',
      watch: false,
    },
    {
      cron_restart: '0 * * * *',
      instances: 1,
      name: 'sAlbums',
      script: 'lib/scrape-albums/run.js',
      watch: false,
    },
  ],
};
