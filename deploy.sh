#!/bin/sh

ROOT_DIR=~/Projects/last-albums-charts

git add "$ROOT_DIR/ssg"
git diff --cached --exit-code && echo 'No changes yet' && exit 0
git commit -m "deploy" $1
git push
echo 'Deploy successful'