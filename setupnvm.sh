#!/bin/bash

# this script sets up and installs the javascript tet tools

# get npm on the command line. I use nvm to hide it in my local home folder. so i need to use it
# use nvm list to see what version of npm I have

source ~/.nvm/nvm.sh

nvm list
# nvm use v0.12.2
nvm use v0.12.9
