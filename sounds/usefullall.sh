#!/bin/bash
for f in *.wav; do
    ./usefull.sh ${f:0:-4}
done
