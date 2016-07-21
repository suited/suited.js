
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
var Plugin = require('../../plugin.js');
var Mode = require('./mode.js');
var modePlugin = new Plugin("ModePlugin");
import builtinModeList from './builtins';


modePlugin.modeNames = [];
modePlugin.modes = {};
modePlugin.currentMode = 0;

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
    var modes = this.modeNames.map(function(i, e){
       if (e.modeName != modeName) {
           return e;
       } 
    });
    
    if (count == this.modes.length) {
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
        oldMode.cleanUp(); // this can fix the display, and kills the mode specific listeners    
    }
       
    var newMode = this.modes[modeName];
    this.currentMode = this.modeNames.indexOf(modeName);

    state.setMode(modeName, newMode.shouldShowSlide);
    
    newMode.beforeModeChange(); // can be used by a mode to start its own special event listeners eg to set a page specific transition
    newMode.beforeSlideChange(state.currentSlideName());
    newMode.afterSlideChange(state.currentSlideName());
        
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

modePlugin.addCallback("BeforeSlideChange", function(state, evData){
    var slideId = state.currentSlideName();    
    modePlugin.getCurrentMode().beforeSlideChange(slideId);
    
    return state;
});

modePlugin.addCallback("AfterSlideChange", function(state, evData){
    var slideId = state.currentSlideName();
    modePlugin.getCurrentMode().afterSlideChange(slideId);    
    
    return state;
});

/**
 * Add all the modes here. We may want to externalise this.....
 */
builtinModeList.forEach(function(v){
    modePlugin.addMode(v);
})

module.exports = modePlugin;
