#!/bin/bash

# @Author: Roberts Karl <Karl_Roberts>
# @Date:   2016-Aug-02
# @Project: suited
# @Last modified by:   Karl_Roberts
# @Last modified time: 2016-Aug-02
# @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.


# this script sets up and installs the javascript tet tools

# get npm on the command line. I use nvm to hide it in my local home folder. so i need to use it
# use nvm list to see what version of npm I have

source ~/.nvm/nvm.sh

nvm install v6.3.1
nvm list
# nvm use v6.3.1
nvm use v6.3.1
