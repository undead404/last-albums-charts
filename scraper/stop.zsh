#!/bin/zsh
set -e
{
  PATH="$PATH:/usr/local/bin"
  cd ~/Projects/last-albums-charts/scraper
  ~/.yarn/bin/yarn stop
} >> ~/Projects/last-albums-charts/scraper/logs/stop.log 2>&1
