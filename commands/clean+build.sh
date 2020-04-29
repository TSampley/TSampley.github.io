#!/bin/sh

for dir in "_site"; do
  rm -rf "$dir" || exit 1
done

printf "Cleaned site. Building\n"
scripts/build.sh
