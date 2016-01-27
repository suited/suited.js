'use strict';
//konfig.js
/**
 * Configuration variables and functions.
 * users should feel free to extend the config object or override it's varible to suit their tastes.
 **/

/*
Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com> 

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var konstants = require('./konstantes.js');
var k = konstants;

var c = {};

c.modalBackdropOpacity = 0.8;

c.transitionName = {};
c.transitionName.doc = k.defaultTnames["scroll"];
c.transitionName.deck = k.defaultTnames["jump"];
c.transitionName.walkthrough = k.defaultTnames["scrollzoom"];

c.transitions = {};
c.transitions["jump"] = k.defaultTransitions.jump;
c.transitions["scrollzoom"] = k.defaultTransitions.scrollzoom;
c.transitions["scroll"] = k.defaultTransitions.scroll;



module.exports = c;
