#!/bin/sh

ROOT_DIR=~/Projects/last-albums-charts

git diff --exit-code "$ROOT_DIR/ssg" && echo 'No changes yet' && exit 0
git add ../ssg
git commit -m "deploy" $1
git push
echo 'Deploy successful'