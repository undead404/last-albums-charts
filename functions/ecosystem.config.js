const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  apps: [
    {
      autorestart: true,
      cron_restart: '*/5 * * * *',
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
      cron_restart: '45 6 * * *',
      env: {
        APP_NAME: 'deploy',
        // SKIP_DEPLOY: true,
      },
      exec_mode: 'fork',
      instances: 1,
      name: 'deploy',
      script: 'lib/deploy/deploy.js',
      watch: false,
    },
    {
      autorestart: true,
      cron_restart: '45 0 * * *',
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
      cron_restart: '0 2 * * *',
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
