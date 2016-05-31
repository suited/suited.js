'use strict';
//core.js
/**
 * Core behavious of the suited.js javascript library
 *
 * mostly concerned with the interactivity of the web page that it is attached to.
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


/* Core features and management - eg finds and tags all slide elements */

var polyfils = require('./polyfills.js');
var konstants = require('./konstantes.js')
var konfig = require('./konfig.js')
var utils = require('./utils.js');
var State = require('./state.js');
//var modeList = require('./modes.js');
var Dispatch = require('./dispatch.js');
var Plugin = require('./plugin.js');
var Suited = require('./suited.js');
var LifeCycle = require('./lifecycle.js');
var builtins = require('./plugins').builtins;


var k = konstants;
var c = konfig;
var state = {};

var core = function () {};

/**
 * Toggle the presentation mode. If newMode is provided then set mode to that, 
 * else get state to switch to the next mode
 *   - If left out then next mode is selected
 * @param {String} newMode (Optional) The mode to switch to.
 */
core.toggleMode = function (newMode) {
  if (newMode) {
    window.suited.fireEvent("SetMode", state, {modeName: newMode})
    //@@@state.changeMode(newMode);
  } else {
    window.suited.fireEvent("NextMode", state)
    //@@@state.toggleMode();
  }

  //We need to do this because going into deck, we need to do the slide stuff.
  //@@@state.mode().afterSlideChange(state.currentSlideName());

  //fix location bar
  window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.getCurrentModeName() + "#" + state.currentSlideName());
}

core.hashChanged = function (location) {
 // window.suited.fireEvent("LocationChange", state, {location: location});
  console.log("Location changed!" + location);
  var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";

  var theSlideNum = utils.parseSlideNum(window.location.hash);
  var queryParams = utils.parseParams(window.location.search);
  var mode = queryParams['mode'];    
    
  core.toggleMode(mode);  
    
  state.setSlideNumber(theSlideNum);
};

core.processEventQueueBeforeAction = function () {
  //if I'm gonna handle the queue, maybe need to lock it?
  //TODO am I gonna do it all or as much as I can within a timeout? and leave a high water mark?
  console.log("pre-process Queue");
}

core.processEventQueueAfterAction = function () {
  //TODO do i need to lock the queue?
  console.log("post-process Queue");
  //TODO should I process the queue to the end, or just within a timeout, and have a reeper thread running to keep emptying the queue? while the user does nothing?
}


/**
 * Handle the shortcuts and arrow navigation
 * 
 * keycodes are: left = 37, up = 38, right = 39, down = 40
 */
core.addKeyListeners = function () {

  document.onkeyup = function (evt) {
    //do anything that needs to be done..
    core.processEventQueueBeforeAction();

    //TODO Do I just make the keypress fire the appropriate events an run all the correct handlers in post processing?
    var kc = evt.keyCode;
    switch (kc) {
      case 27: //escape
        core.toggleMode();
        console.log("Mode reset to doc");

        break;
      case 37: // Left arrow
        console.log("Previous " + evt.keyCode);

        window.suited.fireEvent("BeforeSlideChange", state);
        window.suited.fireEvent("GoBack", state);
        window.suited.fireEvent("AfterSlideChange", state);
        break;
      case 39: // Right arrow
        console.log("Next " + evt.keyCode);
        window.suited.fireEvent("BeforeSlideChange", state);
        window.suited.fireEvent("GoForward", state);
        window.suited.fireEvent("AfterSlideChange", state);
        break;
      case 83: //s
        if (evt.shiftKey) {
          core.toggleMode(); //side effect on state.mode
          console.log("current mode: " + state.currentMode);
        }
        break;
      case 84: //t
        if (evt.shiftKey) {
          var transitionFunc = utils.findTransition("top", elId, state.currentMode);
          transitionFunc(elId);
          window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#");

          console.log("current mode: " + state.currentMode);
        }
        break;
    };

    //do anything that needs to be done..
    core.processEventQueueAfterAction();

  };


};

core.init = function () {

  //add a defaul
  var pageLogger = new Plugin("pageLogger");

  var vHandler = function (v) {
    console.log("VALUE HANDLER: v is " + JSON.stringify(v));
  }

  pageLogger.addCallback("BeforeSlideChange", function (state, evData) {
    console.log("pageLogger: leaving state: " + state.currentSlideName())
    return {
      'state': state,
      'value': "BeforeStateChange Magic Value1"
    }
  }, vHandler)

  pageLogger.addCallback("AfterSlideChange", function (state) {
    console.log("pageLogger: entered*** state: " + state.currentSlideName())
    return {
      'state': state
    }
  })

  var defaultPlugins = builtins;
  defaultPlugins.push(pageLogger);


  var theDispatch = new Dispatch();
  window.suited = new Suited(theDispatch);
  suited.addPlugins(defaultPlugins);

  window.suited.fireEvent("PluginsLoaded", state);


  console.log("Suited is " + JSON.stringify(window.suited));

  var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";
  var navigableSlides = utils.selects(selectString) 
  utils.number(navigableSlides);

  state = new State(0, navigableSlides);

    
  // add placeholder for Modal backdrop
  var b = document.body;

  //pimp body to add our slide modals
  var slideWall = document.createElement("div");
  slideWall.setAttribute("id", k.modalBackdrop);
  b.appendChild(slideWall);

  var slideHolder = document.createElement("div");
  slideHolder.setAttribute("id", k.slideHolder);
  b.appendChild(slideHolder);

  //Add the modal backdrop element TODO template layouty stuff should do this
  //slideHolder.innerHTML = '<div style="float: left; width: 20%;">&nbsp;</div><div id="' + k.modal + '" style="float: left; width:60%">&nbsp;</div><div style="float: left; width: 20%;">&nbsp;</div>';
  slideHolder.innerHTML = '<div id="' + k.modal + '"></div>';

  //Create new state object and put everything in the right state 
  core.hashChanged(window.location);

  //interactivity
  core.addKeyListeners();

  window.addEventListener("hashchange", function (e) {
    core.hashChanged(window.location);
  });
};


module.exports = core;
