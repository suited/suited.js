/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   robertk
* @Last modified time: 2016-Aug-14
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

var konfig = require('../konfig.js')
var utils = require('../utils.js');
//var State = require('../state.js');
var Dispatch = require('../dispatch.js');
var Plugin = require('../plugin.js');

var slideChangePlugin = new Plugin("SlideChangePlugin");

slideChangePlugin.addCallback("GoBack", function (state, evData) {
  console.log("slideChangePlugin: currentSlide before: " + state.currentSlideName())
    //handle state change and transition
  var currentSlide = state.currentSlideName();
  var elId = state.previous(); //side effect on state.mode
  if (currentSlide === elId) {
    var theMode = state.getCurrentMode();
    var transitionFunc = theMode.findTransition("top", elId);
    transitionFunc(elId);

    state.setSlideNumber(0);
    window.suited.fireEvent("LocationChanged", state);
  } else {
    var slideNum = utils.parseSlideNum("#" + elId);
    var theMode = state.getCurrentMode();
    var transitionFunc = theMode.findTransition("left", elId);
    transitionFunc(elId);
    state.setSlideNumber(slideNum); // side effect on state mode and currentSlide ie state is modified too as it contains that

    window.suited.fireEvent("LocationChanged", state);

    console.log("slideChangePlugin: slide=" + state.currentSlideName() + " state.mode is " + state.getCurrentModeName());
  }
  return {
    'state': state
      //,'value': "BeforeStateChange Magic Value1"
  }
})

slideChangePlugin.addCallback("GoForward", function (state, evData) {
  console.log("slideChangePlugin: currentSlide before: " + state.currentSlideName());

  //handle state change and transition
  var elId = state.next(); // side effect on state
  var slideNum = utils.parseSlideNum("#" + elId);
  var theMode = state.getCurrentMode();
  var transitionFunc = theMode.findTransition("right", elId);
  transitionFunc(elId);
  state.setSlideNumber(slideNum);

  window.suited.fireEvent("LocationChanged", state);

  console.log("slideChangePlugin: slide=" + state.currentSlideName() + " state.mode is " + state.getCurrentModeName());
  return {
    'state': state
      //,'value': "BeforeStateChange Magic Value1"
  }
})

module.exports = slideChangePlugin;
