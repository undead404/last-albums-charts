#!/bin/zsh

for file in ./correction_*.sql; do
  psql lac -d lac -f $file;
done
