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

modePlugin.modes = [];
modePlugin.currentMode = null;

modePlugin.addMode(mode) {
    if (mode instanceof Mode){
        modes.push(mode)
    }
    else {
        console.error("Failed to add mode. Is not instanceof Mode. Received: " + mode)    
    }
};

modePlugin.removeMode(modeName) {
    count = modes.length;
    modes = modes.map(function(i, e){
       if (e.modeName === modeName) {
           return e;
       } 
    });
    
    if (count == modes.length) {
        console.warn("No mode removed. Mode: " + modeName + " not found");
    }
};



modePlugin.addCallback("NextMode", function(state, evDate){
    
});

modePlugin.addCallback("PrevMode", function(state, evDate){
    
});

modePlugin.addCallback("SetMode", function(state, evDate){
    
});

modePlugin.addCallback("BeforeSlideChange", function(state, evDate){
    
});

modePlugin.addCallback("AfterSlideChange", function(state, evDate){
    
});

module.exports = Mode;
