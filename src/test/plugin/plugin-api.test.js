/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-02
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

var k = require('../../main/assets/js/konstantes.js');
var Plugin = require('../../main/assets/js/plugin.js');

describe("Suited API tests.", function () {

  afterEach(function () {
    // runs after each test in this block
    //    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    //    var lc = new LifeCycle();
    //    var es = lc.events;
    //    //lookup handlers for es[0] and assert it has no handlers.
    //    var e0hs = lc.lookupHandlers(es[0]);
    //    expect(e0hs).to.be.empty;
  });


  it("Plugins return a modified state if one is passed in", function () {
    var p1 = "fixme"
    expect(p1).to.equals("muppet");
  });

});
