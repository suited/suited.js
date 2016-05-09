'use strict';

var konfig = require('./konfig.js')
var utils = require('./utils.js');
var State = require('./state.js');
var modeList = require('./modes.js');
var Dispatch = require('./dispatch.js');
var Plugin = require('./plugin.js');

//array of plugins
var builtins = [];

var slideChangePlugin = new Plugin("slideChangePlugin");

slideChangePlugin.addCallback("GoBack", function (state, evData) {
  console.log("slideChangePlugin: currentSlide before: " + state.currentSlideName())
    //handle state change and transition
  var currentSlide = state.currentSlideName();
  var elId = state.previous(); //side effect on state.mode
  if (currentSlide === elId) {
    var transitionFunc = utils.findTransition("top", elId, state.currentMode);
    transitionFunc(elId);
    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#");
  } else {
    var slideNum = utils.parseSlideNum("#" + elId);
    var transitionFunc = utils.findTransition("left", elId, state.currentMode);
    transitionFunc(elId);
    state.changeState(slideNum); // side effect on state mode and currentSlide ie state is modified too as it contains that

    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#" + state.currentSlideName());

    console.log("slideChangePlugin: slide=" + state.currentSlideName() + " state.mode is " + state.currentMode);
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
  var transitionFunc = utils.findTransition("right", elId, state.currentMode);
  transitionFunc(elId);
  state.changeState(slideNum);
  window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#" + state.currentSlideName());

  console.log("slideChangePlugin: slide=" + state.currentSlideName() + " state.mode is " + state.currentMode);
  return {
    'state': state
      //,'value': "BeforeStateChange Magic Value1"
  }
})
builtins.push(slideChangePlugin)


module.exports = builtins;
