/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   robertk
* @Last modified time: 2016-Aug-12
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

import builtinModeList from './builtins';
import utils from '../../utils.js';
import constants from '../../konstantes.js';

'use strict';
//state.js
/**
 * The state of the system. Supports the Suited framework and keep track of the current slide and mode
 * and allos the state to be manipulated.
 *
 * @returns {Object}   Containing the functions necessary to check and manipulate the state
 */

var Plugin = require('../../plugin.js');
var Mode = require('./mode.js');
var modePlugin = new Plugin("ModePlugin");


function  cleanUpOldStyle() {
  var modeCss = document.getElementById(constants.STYLE_FOR_MODE_ID)
  modeCss.innerHTML = "";
}
function  addModeStyleElement() {
  // var theHeadHTML = document.head.innerHTML
  // var newHTML = theHeadHTML + ' <style id="'+ constants.STYLE_FOR_MODE_ID +'" type="text/css">'
  // document.head.innerHTML = newHTML;
  var h = document.getElementsByTagName('head').item(0);
  var s = document.createElement("style");
  s.type = "text/css";
  s.id = constants.STYLE_FOR_MODE_ID;
  //s.appendChild(document.createTextNode("a{font-size:100px;}");
  h.appendChild(s);
  return constants.STYLE_FOR_MODE_ID;
}
function  cleanUpBodyClass(modename) {
  if(!!modename) _bodyClass(modename, false);
}
function  addBodyClass(modename) {
  if(!!modename) _bodyClass(modename, true);
}

function _bodyClass(modename, addit){
  utils.classed(document.body, modename, addit)
}


modePlugin.modeNames = [];
modePlugin.modes = {};
modePlugin.currentMode = 0;
modePlugin.modeCssId = addModeStyleElement(); // side effect on HEAD

modePlugin.addMode = function(mode) {
    console.debug("Adding mode: " + mode);
    if (mode instanceof Mode) {
        var modeName = mode.name;
        this.modeNames.push(modeName);
        this.modes[modeName] = mode;
    }
    else {
        console.error("Failed to add mode. Is not instanceof Mode. Received: " + mode);
    }
};

modePlugin.removeMode = function(modeName) {
    var count = this.modeNames.length;

    this.modeNames = this.modeNames.filter(function(e, i){
       if (e !== modeName) {
         return e;
       }
    });

    delete this.modes[modeName];

    if (count == this.modeNames.length) {
        console.warn("No mode removed. Mode: " + modeName + " not found");
    }

};

modePlugin.getCurrentModeName = function() {
    return this.modeNames[this.currentMode];
}

modePlugin.getCurrentMode = function() {
    return this.modes[this.getCurrentModeName()];
}

modePlugin.setMode = function(modeName, state) {
    console.debug("New mode is: " + modeName);
    if (!modeName) {
        console.warn("ModeName is empty changing to mode 0");
        modeName = this.modeNames[0];
    }

    if (this.modeNames.indexOf(modeName) < 0) {
        console.warn("ModeName (" + modeName + ") is invalid. Valid modes(" + this.modeNames + ") Changing to mode 0");
        modeName = this.modeNames[0];
    }

    var oldMode = this.getCurrentMode();
    if (!!oldMode) {
        //TODO should I fire MODECLEANUP event here and have modes listen for it? or just call the cleanup function?
        oldMode.cleanUp(state); // this can fix the display, and kills the mode specific listeners
        //dregister the mode as a plugin
        window.suited.removePlugin(oldMode.name)
    }



    var newMode = this.modes[modeName];
    this.currentMode = this.modeNames.indexOf(modeName);

    window.suited.addPlugins([newMode], state);
    state.setMode(newMode, newMode.shouldShowSlide);



    //fire mode change lifecycle event
    window.suited.fireEvent("BeforeModeChange", state, {"oldMode": oldMode, "newMode": newMode});
    cleanUpOldStyle();
    cleanUpBodyClass(oldMode.name);

    // refire lifecycle events to get next mode to behave as if it was already seleted and moved to this point.
    window.suited.fireEvent("BeforeSlideChange", state);
    window.suited.fireEvent("AfterSlideChange", state);

    //fire mode change lifecycle event
    addBodyClass(newMode.name)
    window.suited.fireEvent("ModeCSSFree", state, {"styleId": constants.STYLE_FOR_MODE_ID});
    window.suited.fireEvent("AfterModeChange", state, {"oldMode": oldMode, "newMode": newMode});

    return newMode;
}


modePlugin.addCallback("NextMode", function(state, evData){
    console.debug("Next mode...");
    var pos = modePlugin.currentMode + 1;
    var modeName = "";

    if (pos > 0 && pos < modePlugin.modeNames.length) {
        modeName = modePlugin.modeNames[pos];
    }
    else {
        modeName = modePlugin.modeNames[0];
    }
    modePlugin.setMode(modeName, state);

    return {
    'state': state
    };
});

modePlugin.addCallback("PrevMode", function(state, evData){
    var pos = modePlugin.currentMode - 1;
    if (pos >= 0 && pos < modePlugin.modeNames.length) {
        modeName = modePlugin.modeNames[pos];
    }
    else {
        modeName = modePlugin.modeNames[modeNames.length - 1];
    }
    modePlugin.setMode(modeName, state);

    return {
        'state': state
    };
});

modePlugin.addCallback("SetMode", function(state, evData) {
    modePlugin.setMode(evData.modeName, state);

    return {
        'state': state
    };
});

modePlugin.addCallback("SetModeNum", function(state, evData) {
    var modeNum = parseInt(evData.modeNum);
    var modeName = modePlugin.modeNames[modeNum];
    if(!!modeName){
      //only change mode if there is one
      modePlugin.setMode(modeName, state);
    }

    return {
        'state': state
    };
});

modePlugin.addCallback("ESC", function(state, evData) {
  if (!modePlugin.getCurrentMode().handlesEvent("ESC")) {
    modePlugin.setMode(modePlugin.modeNames[0], state);

    window.suited.fireEvent("LocationChanged", state);
  }
  return {
    'state': state
  }
});

// modePlugin.addCallback("BeforeSlideChange", function(state, evData){
//     var slideId = state.currentSlideName();
//     modePlugin.getCurrentMode().beforeSlideChange(slideId);
//
//     return state;
// });

// modePlugin.addCallback("AfterSlideChange", function(state, evData){
//     var slideId = state.currentSlideName();
//     modePlugin.getCurrentMode().afterSlideChange(slideId);
//
//     return state;
// });

/**
 * Add all the modes here. We may want to externalise this.....
 */
builtinModeList.forEach(function(v){
    modePlugin.addMode(v);
})





module.exports = modePlugin;
