'use strict';

var konfig = require('../konfig.js')
var utils = require('../utils.js');
//var State = require('../state.js');
var Dispatch = require('../dispatch.js');
var Plugin = require('../plugin.js');

var slideChangePlugin = new Plugin("slideChangePlugin");

slideChangePlugin.addCallback("GoBack", function (state, evData) {
  console.log("slideChangePlugin: currentSlide before: " + state.currentSlideName())
    //handle state change and transition
  var currentSlide = state.currentSlideName();
  var elId = state.previous(); //side effect on state.mode
  if (currentSlide === elId) {
    var transitionFunc = utils.findTransition("top", elId, state.getCurrentModeName());
    transitionFunc(elId);
    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.getCurrentModeName() + "#");
  } else {
    var slideNum = utils.parseSlideNum("#" + elId);
    var transitionFunc = utils.findTransition("left", elId, state.getCurrentModeName());
    transitionFunc(elId);
    state.setSlideNumber(slideNum); // side effect on state mode and currentSlide ie state is modified too as it contains that

    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.getCurrentModeName() + "#" + state.currentSlideName());

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
  var transitionFunc = utils.findTransition("right", elId, state.getCurrentModeName());
  transitionFunc(elId);
  state.setSlideNumber(slideNum);
  window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.getCurrentModeName() + "#" + state.currentSlideName());

  console.log("slideChangePlugin: slide=" + state.currentSlideName() + " state.mode is " + state.getCurrentModeName());
  return {
    'state': state
      //,'value': "BeforeStateChange Magic Value1"
  }
})

module.exports = slideChangePlugin;