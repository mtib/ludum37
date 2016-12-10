#!/bin/bash
for ext in "ogg" "mp3"; do
    ffmpeg -i $1.wav -ac 1 -ab 96k $1.$ext
done
