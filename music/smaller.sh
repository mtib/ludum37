#!/bin/bash
name=$1

mkdir .tmp
for ext in "ogg" "mp3"; do
    ffmpeg -i "$name.$ext" -ar 44100 -ac 1 -ab 96k "o_$name.$ext"
    mv "$name.$ext" ".tmp/${name}_old.$ext"
    mv "o_$name.$ext" "$name.$ext"
done
