#!/bin/sh

git diff --exit-code ../ssg && exit 0
git add ../ssg
git commit -m "deploy" $1
git push
