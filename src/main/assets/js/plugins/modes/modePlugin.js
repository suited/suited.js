'use strict';
//state.js
/**
 * The state of the system. Supports the Suited framework and keep track of the current slide and mode
 * and allos the state to be manipulated.
 * 
 * @returns {Object}   Containing the functions necessary to check and manipulate the state
 */

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
var modePlugin = new Plugin("ModePlugin");

var modeList = require('./modes.js');


modePlugin.modeNames = [];
modePlugin.modes = {};
modePlugin.currentMode = 0;

modePlugin.addMode(mode) {
    if (mode instanceof Mode) {
        var modeName = mode.name;
        modePlugin.modeNames.push(modeName);
        modePlugin.modes[modeName] = mode;
    }
    else {
        console.error("Failed to add mode. Is not instanceof Mode. Received: " + mode);
    }
};

modePlugin.removeMode(modeName) {
    var count = modePlugin.modeNames.length;
    var modes = modePlugin.modeNames.map(function(i, e){
       if (e.modeName != modeName) {
           return e;
       } 
    });
    
    if (count == modePlugin.modes.length) {
        console.warn("No mode removed. Mode: " + modeName + " not found");
    }
};

modePluging.getCurrentMode() {
    return modePlugin.modes[modePlugin.currentMode];
}

modePluging.setMode(modeName) {
    
    if (!modeName) {
        console.warn("ModeName is empty changing to mode 0");
        modeName = modePlugin.modeNames[0];
    }
    
    if (modeNames.indexOf(modeName) < 0) {
        console.warn("ModeName (" + modeName + ") is invalid. Changing to mode 0");        
        modeName = modePlugin.modeNames[0];
    }
    
    var oldMode = modePlugin.getCurrentMode();
    if (!!oldMode) {
        oldMode.cleanUp();    
    }
       
    var newMode = modePlugin.modes[modeName];
    var currentMode = modePlugin.modeNames.indexOf(modeName);
    
    newMode.beforeModeChange();
    
    return newMode;
}



modePlugin.addCallback("NextMode", function(state, evData){
    var pos = currentMode + 1;
    var modeName = "";
    if (pos > 0 && pos < modePlugin.modeNames.length) {
        modeName = modePlugin.modeNames[pos];    
    }
    else {
        modeName = modePlugin.modeNames[0];   
    }
    modePlugin.setMode(modeName);
});

modePlugin.addCallback("PrevMode", function(state, evData){
    var pos = currentMode - 1;
    if (pos >= 0 && pos < modePlugin.modeNames.length) {
        modeName = modePlugin.modeNames[pos];    
    }
    else {
        modeName = modePlugin.modeNames[modeNames.length - 1];   
    }
    modePlugin.setMode(modeName);
});

modePlugin.addCallback("SetMode", function(state, evData){
    modePlugin.setMode(evData.modeName);
});

modePlugin.addCallback("BeforeSlideChange", function(state, evData){
    var slideId = state.currentSlideName();
    modePlugin.getCurrentMode().beforeSlideChange(slideId);
});

modePlugin.addCallback("AfterSlideChange", function(state, evData){
    var slideId = state.currentSlideName();
    modePlugin.getCurrentMode().afterSlideChange(slideId);    
});

/**
 * Add all the modes here. We may want to externalise this.....
 */
modeList.forEach(function(v){
    modePlugin.addMode(v);
})

module.exports = modePlugin;
