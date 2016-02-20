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


var konstants = require('./konstantes.js')
var konfig = require('./konfig.js')
var utils = require('./utils.js');
var State = require('./state.js');
var modeList = require('./modes.js');

var modes = modeList.modes;
var k = konstants;
var c = konfig;
var state = {};

var core = function () {};

/**
 * Toggle the presentation mode. If newMode is provided then set mode to that, else get state to switch to the next mode
 * @param {String} newMode (Optional) The mode to switch to. If left out then next mode is selected
 */
core.toggleMode = function (newMode) {
    if (newMode) {
        state.changeMode(newMode);
    } else {
        state.toggleMode();
    }

    //We need to do this because going into deck, we need to do the slide stuff.
    state.mode().afterSlideChange(state.currentSlideName());

    //fix location bar
    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#" + state.currentSlideName());
}

core.hashChanged = function (location) {
    console.log("Location changed!" + location);
    var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";

    var theSlideNum = utils.parseSlideNum(window.location.hash);
    var queryParams = utils.parseParams(window.location.search);
    if (!state.changeState) {
        state = new State(theSlideNum, modes, queryParams["mode"]);
    } else {
        state.changeState(theSlideNum, queryParams["mode"]);
    }

};


/**
 * Handle the shortcuts and arrow navigation
 * 
 * keycodes are: left = 37, up = 38, right = 39, down = 40
 */
core.addKeyListeners = function () {

    document.onkeyup = function (evt) {
        var kc = evt.keyCode;
        switch (kc) {
            case 27: //escape
                core.toggleMode(modes[0]);
                console.log("Mode reset to doc");

                break;
            case 37: // Left arrow
                console.log("Previous " + evt.keyCode);

                //handle state change and transition
                var currentSlide = state.currentSlideName();
                var elId = state.previous(); //side effect on state.mode
                if (currentSlide === elId) {
                    var transitionFunc = utils.findTransition("top", elId, state.currentMode);
                    transitionFunc(elId);
                    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#");
                }
                else {
                    var slideNum = utils.parseSlideNum("#" + elId);
                    var transitionFunc = utils.findTransition("left", elId, state.currentMode);
                    transitionFunc(elId);
                    state.changeState(slideNum);

                    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#" + state.currentSlideName());

                    console.log("slide=" + state.currentSlideName() + " state.mode is " + state.currentMode);
                }
                break;
            case 39: // Right arrow
                console.log("Next " + evt.keyCode);

                //handle state change and transition
                var elId = state.next(); // side effect on state
                var slideNum = utils.parseSlideNum("#" + elId);
                var transitionFunc = utils.findTransition("right", elId, state.currentMode);
                transitionFunc(elId);
                state.changeState(slideNum);
                window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.currentMode + "#" + state.currentSlideName());

                console.log("slide=" + state.currentSlideName() + " state.mode is " + state.currentMode);
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

    };
};


core.init = function () {
    var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";
    utils.number(utils.selects(selectString));

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
