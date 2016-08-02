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

var modePlugin = require('../../../main/assets/js/plugins/modes/modePlugin.js');
var Mode = require('../../../main/assets/js/plugins/modes/mode.js');

describe("Test mode plugin", function () {

  it("Can add a mode", function() {

    var theMode = new Mode("testMode");

    var modeCount = modePlugin.modeNames.length;
    modePlugin.addMode(theMode);

    expect(modePlugin.modeNames.length).to.equal(modeCount + 1);
    expect(modePlugin.modeNames[modeCount]).to.equal("testMode");
    expect(modePlugin.modes["testMode"]).to.equal(theMode);

  });
  

  it("Can remove a mode", function() {

    var theMode = new Mode("removeMode");
    var modeCount = modePlugin.modeNames.length;

    modePlugin.addMode(theMode);
    expect(modePlugin.modeNames.length).to.equal(modeCount + 1);
    expect(modePlugin.modeNames[modeCount]).to.equal("removeMode");
    expect(modePlugin.modes["removeMode"]).to.equal(theMode);

    modePlugin.removeMode("removeMode");
    expect(modePlugin.modeNames.length).to.equal(modeCount);
    expect(modePlugin.modes["removeMode"]).to.be.undefined;
  });

});
