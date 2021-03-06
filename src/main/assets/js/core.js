/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-03
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
//core.js
/**
 * Core behavious of the suited.js javascript library
 *
 * mostly concerned with the interactivity of the web page that it is attached to.
 **/

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
  window.suited.fireEvent("LocationChanged", state);
}

/**
 * Set the mode by mode number. NB keyNumber is the value written on the keyboard number key eg 1. However Modes are numbered from zero so always subtract 1
 * this is safe because I am only allowing keys 1-9 to be Modes
**/
core.toggleModeByNum = function (keyNumber) {
  //prevent empty or 0 from doing anything
  console.debug("toggleModeByNum " + keyNumber);
  if (!!keyNumber) {
    var num = (parseInt(keyNumber) - 1);
    window.suited.fireEvent("SetModeNum", state, {modeNum: num})
    //@@@state.changeMode(newMode);
  } else {
   //ignore
  }

  //We need to do this because going into deck, we need to do the slide stuff.
  //@@@state.mode().afterSlideChange(state.currentSlideName());

  //fix location bar
  window.suited.fireEvent("LocationChanged", state);
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
  //TODO should I process the queue to the end, or just within a timeout, and have a reeper thread running to keep emptying the queue? while the user does nothing?/config
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
    case 13: //Enter clicked
        window.suited.fireEvent("ENTER", state, evt);
        break;
    case 27: //escape just let the world know with special ESC Event, modes can do what is appropriate
        //        core.toggleMode('doc');
        //        console.log("Mode reset to doc");
        window.suited.fireEvent("ESC", state, evt);

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
        // if (evt.shiftKey) {
        core.toggleMode(); //side effect on state.mode
        console.log("current mode: " + state.currentMode);
        // }
        break;
    case 49: // '1'
    case 50: // '2'
    case 51: // '3'
    case 52: // '4'
    case 53: // '5'
    case 54: // '6'
    case 55: // '7'
    case 56: // '8'
    case 57: // '9'
        // if(evt.shiftKey) {
        var keyNum = parseInt(kc);
        core.toggleModeByNum((keyNum - 48)); //map 49 ->1 ... 57 -> 9
        // }
        break;

    case 84: //t
        if (evt.shiftKey) {
            var transitionFunc = state.findTransition("top", null);
            transitionFunc(null);

            window.suited.fireEvent("LocationChanged", state);

            console.log("current mode: " + state.currentMode);
        }
        break;
    default: //anything else
        window.suited.fireEvent("KEY_PRESSED_" + kc, state, evt);
        break;
};

    //do anything that needs to be done..
    core.processEventQueueAfterAction();

  };


};

// just know where the mouse is.
core.addMouseListeners = function() {
  // Monitor mouse movement for panning
	document.addEventListener( 'mousemove', function( event ) {

			window.suited.mouseX = event.clientX;
			window.suited.mouseY = event.clientY;

	} );
}

// just track clicks in thesuited event system
core.addClickListeners = function() {
  // Monitor mouse movement for panning
	document.addEventListener( 'click', function( event ) {
      console.log("+++++++++++++  first event = "+ event)
			window.suited.fireEvent("CLICK", state, event);
	} );
}

core.init = function () {

  // SETUP the initial state.
  state = new State(0, []);

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

  //get user specified settings fron the document and merge with our settings
  var userSuited = window.suited || {};
  //replace with ours
  window.suited = new Suited(theDispatch);


  //read custom userConfig and add it to plugins
  if(!!userSuited.config) {
    window.suited.config(userSuited.config);
    console.log("<><><><<><>!!!!!!!!!!!! config now ", JSON.stringify(window.suited.config(),null,2))
  }
  window.suited.fireEvent("ConfigMerged", state);

  //suited add plugin will add plugin config too
  window.suited.addPlugins(defaultPlugins, state);

  //user defined plugins
  if(!!userSuited.plugins){
    var ps = Array.prototype.slice.call(userSuited.plugins); //coerce array
    window.suited.addPlugins(ps, state);
  }
  window.suited.fireEvent("PluginsLoaded", state);
  //fixup any navigableify state
  // some plugins (eg Markdown) modify the DOM which may change or create navigableSlides
  // TODO Mode should walk doc for navigable slides do this on mode change, let it set up state
  var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";
  var navigableSlides = utils.selects(selectString)
  utils.number(navigableSlides);
  state.setNavigableNodes(navigableSlides)


  // configure plugins
  //add user config
  var pnames = window.suited.getPluginNames();
  pnames.forEach(function(pname,i,a){
    var ps = window.suited.getPluginsByName(pname);
    ps.forEach(function(p,ii,aa){
      var configForPlugin = window.suited.config().plugins[p.name];
      if(!!configForPlugin) {
        console.log("Suited: Seen config for plugin: "+p.name+ ". Passing to plugin");
        p.config(configForPlugin);
        window.suited.fireEvent(p.name+"-ConfigMerged", state);
      }
    })

  })




  console.log("Suited is " + JSON.stringify(window.suited));




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

  core.addMouseListeners();
  core.addClickListeners();
};


module.exports = core;
