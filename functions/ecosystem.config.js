const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  apps: [
    {
      autorestart: false,
      cron_restart: '45 6 * * *',
      env: {
        APP_NAME: 'deploy',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'deploy',
      script: 'lib/deploy/deploy.js',
      watch: false,
    },
    {
      cron_restart: '45 * * * *',
      env: {
        APP_NAME: 'fAlbums',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'fAlbums',
      script: 'lib/fix-albums/run.js',
      watch: false,
    },
    {
      autorestart: true,
      cron_restart: '50 * * * *',
      env: {
        APP_NAME: 'gList',
      },
      exec_mode: 'fork',
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
      env: {
        APP_NAME: 'paCover',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'paCover',
      restart_delay: 200,
      script: 'lib/populate-album-cover/run.js',
      watch: false,
    },
    {
      cron_restart: '10 * * * *',
      env: {
        APP_NAME: 'paDate',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'paDate',
      restart_delay: 200,
      script: 'lib/populate-album-date/run.js',
      watch: false,
    },
    {
      cron_restart: '15 * * * *',
      instances: 1,
      env: {
        APP_NAME: 'paStats',
      },
      exec_mode: 'fork',
      name: 'paStats',
      restart_delay: 200,
      script: 'lib/populate-album-stats/run.js',
      watch: false,
    },
    {
      cron_restart: '20 * * * *',
      env: {
        APP_NAME: 'paTags',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'paTags',
      restart_delay: 200,
      script: 'lib/populate-album-tags/run.js',
      watch: false,
    },
    {
      cron_restart: '* * * * *',
      env: {
        APP_NAME: 'ptWeight',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'ptWeight',
      script: 'lib/populate-tag-weight/run.js',
      watch: false,
    },
    {
      autorestart: true,
      cron_restart: '0 * * * *',
      env: {
        APP_NAME: 'sAlbums',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'sAlbums',
      script: 'lib/scrape-albums/run.js',
      watch: false,
    },
    {
      // cron_restart: '0 */2 * * *',
      env: {
        APP_NAME: 'tPerf',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'tPerf',
      script: 'lib/track-performance/run.js',
      watch: false,
    },
    {
      cron_restart: '* * * * *',
      env: {
        APP_NAME: 'utWeight',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'utWeight',
      script: 'lib/update-tag-weight/run.js',
      watch: false,
    },
    {
      autorestart: true,
      cron_restart: '* * * * *',
      env: {
        APP_NAME: 'uList',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'uList',
      script: 'lib/update-list/run.js',
      watch: false,
    },
  ],
};
