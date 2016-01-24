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

var konstants = require('./konstants.js');
var utils = require('./utils.js');

var modes = konstants.modes;

var s = {};

s.numSlides = 0;
s.currentNum = 0; //the currently selected section
s.mode = modes[0]; //or deck

s.previousNum = function () {
    if (s.currentNum <= 0) {
        return s.currentNum;
    } else {
        return (s.currentNum - 1);
    }
};

s.isDeck = function () {
    return (s.mode === modes[1]);
}
s.isDoc = function () {
    return (s.mode === modes[0]);
}
s.isWalkthrough = function () {
    return (s.mode === modes[2]);
}

s.slideName = function () {
    return "slide-" + s.currentNum;
};

s.previousSlideName = s.slideName(); //initially

s.next = function () {
    if (s.currentNum >= s.numSlides) {
        return s.slideName();
    }
    s.previousSlideName = s.slideName();
    s.currentNum++;

    return s.slideName();
};

s.previous = function () {
    if (s.currentNum <= 0) {
        return s.slideName();
    }
    s.previousSlideName = s.slideName();
    s.currentNum--;

    return s.slideName();
};

s.currentNode = function () {
    return document.getElementById(s.slideName());
};

s.previousNode = function () {
    return document.getElementById(s.previousSlideName);
};

s.setMode = function (mode) {
    s.mode = mode;
};

s.toggleMode = function () {

    var modeNum = modes.indexOf(s.mode) + 1;
    if (modeNum >= modes.length) {
        modeNum = 0;
    }

    s.setMode(modes[modeNum]);
};

s.change = function (paramMap) {
    s.setMode(paramMap.mode);

    var slideNum = utils.parseSlideNum(location.hash);
    if (s.currentNum != slideNum) {
        s.previousSlideName = s.slideName();
        s.currentNum = slideNum;
    }

    s.highlightFunc();
}



module.exports = s;
