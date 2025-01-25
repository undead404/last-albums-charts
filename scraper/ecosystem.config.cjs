const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  apps: [
    {
      autorestart: false,
      cron_restart: '*/10 * * * *',
      env: {
        APP_NAME: 'cList',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'cList',
      script: 'lib/create-list/run.js',
      watch: false,
    },
    {
      autorestart: false,
      cron_restart: '30 * * * *',
      env: {
        APP_NAME: 'deploy2',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'deploy2',
      script: 'lib/deploy/run.js',
      watch: false,
    },
    {
      autorestart: false,
      // cron_restart: '0 2 * * *',
      env: {
        APP_NAME: 'build',
        NODE_OPTIONS: '--max_old_space_size=8192',
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'build',
      script: 'lib/build/run.js',
      watch: false,
    },
    {
      autorestart: false,
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
      // cron_restart: '0 2 * * *',
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
      autorestart: true,
      cron_restart: '0 * * * *',
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
