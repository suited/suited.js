/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-08
* @Project: suited
* @Last modified by:   Dirk_van_Rensburg
* @Last modified time: 2016-Aug-08
* @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

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

'use strict';

var Plugin = require('../../plugin.js');

var locationPlugin = new Plugin("LocationManagerPlugin");

locationPlugin.addCallback("LocationChanged", function(state, evData) {
  var slideId = state.currentSlideName();

  if (evData && evData.slideId) {
    slideId = evData.slideId;
  }
  if (window.location.protocol != 'file:') {
    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.getCurrentModeName() + "#" + slideId);
  }
});


module.exports = locationPlugin;
