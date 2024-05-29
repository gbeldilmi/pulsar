#!/usr/bin/env bash

_fifo="./pulsar.fifo"

rm -f $_fifo
mkfifo $_fifo
