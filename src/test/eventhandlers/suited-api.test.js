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
var Dispatch = require('../../main/assets/js/dispatch.js');
var Suited = require('../../main/assets/js/suited.js');

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


  /*
    it("Valid Plugins can be added.", function () {
      var fakeDispatch = new Dispatch();
      var suited = new Suited(fakeDispatch);
      expect(suited).to.exist;
      var p1 = new Plugin("goodPlugin1");
      expect(p1).to.exist;

      var vHandler = function (v) {
        console.log("cb_Value_handler for spuriousEvent1 is " + v);
      }

      p1.addCallback("spuriousEvent1", function (state, evData) {
        return {
          'state': state,
          'value': "Magic Value"
        }
      }, vHandler)

      var ok = suited.addPlugins([p1]);
      expect(ok).to.be.true;

    });


    it("InValid Plugins are not added.", function () {
      var fakeDispatch = new Dispatch();
      var suited = new Suited(fakeDispatch);
      expect(suited).to.exist;
      var p1 = new Plugin("badPlugin1");
      expect(p1).to.exist;

      var vHandler = function (v) {
        console.log("cb_Value_handler for spuriousEvent1 is " + v);
      }

      p1.addCallback("spuriousEvent1", function (state, evData) {
        return {
          'state': state,
          'value': "Magic Value"
        }
      }, vHandler)

      p1.deregisterCallbacks = function () {}; //overrite it with do nothing

      var ok = suited.addPlugins([p1]);
      expect(ok).to.be.false;

    });*/


  it("Plugins can be removed.", function () {
    var fakeDispatch = new Dispatch();
    var suited = new Suited(fakeDispatch);
    expect(suited).to.exist;
    var p1 = new Plugin("goodPlugin3");
    expect(p1).to.exist;

    var vHandler = function (v) {
      console.log("VALUE HANDLER: v is " + JSON.stringify(v));
    }

    p1.addCallback("spuriousEvent3", function (state, evData) {
      console.log(" ... spuriousEvent3 I'm running 1");
      return {
        'state': state,
        'value': "Magic Value1"
      }
    }, vHandler)

    //second plugin with same name
    var p2 = new Plugin("goodPlugin3");
    expect(p2).to.exist;

    p2.addCallback("spuriousEvent3", function (state, evData) {
      console.log(" ... spuriousEvent3 I'm running 2");
      return {
        'state': state,
        'value': "Magic Value2"
      }
    }, vHandler)


    var ok = suited.addPlugins([p1, p2]);
    expect(ok).to.be.true;

    var ps = suited.getPluginsByName("goodPlugin3");
    expect(ps).not.to.be.empty;
    expect(ps.length).to.equal(2);

    var pnames = suited.getPluginNames();
    expect(pnames.length).to.equal(1);
    expect(pnames[0]).to.equal("goodPlugin3");

    //fire them off
    suited.fireEvent("spuriousEvent3", {
      crap: "crappystate"
    }, {
      d1: "some",
      d2: "eData"
    })

    suited.removePlugin("goodPlugin1")
    ps = suited.getPluginsByName("goodPlugin1");
    expect(ps).to.be.empty;

  });



});
