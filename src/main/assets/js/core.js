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

//    var konstants = {
//        slideAttr: "data-slide",
//        modalBackdrop: "slideWall",
//        slideHolder: "slideHolder",
//        modal: "modal",
//        mode: ["doc", "deck", "walkthrough"]
//    }
var k = konstants;
//    var config = {
//        modalBackdropOpacity: 0.5
//    };

var c = konfig;

var state = {};



var core = function () {};

core.maxModalWidth = 0;
core.maxModalHeight = 0;

core.defaultBefore = function (slideId) {

    var currentNode = document.getElementById(state.currentSlideName());

    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);

};
core.defaultAfter = function (slideId) {
    var isDoc = state.isDoc();
    var isDeck = state.isDeck();
    var isWalk = state.isWalkthrough();

    var currentNode = document.getElementById(state.currentSlideName());

    utils.classed(currentNode, "slide-highlight", isDeck || isWalk);
    utils.classed(currentNode, "muted", isDeck || isWalk);

    if (isDeck) {
        var modal = document.getElementById("modal");

        var temp = document.createElement("div");
        temp.setAttribute("style", "display: inline-block; visible: false;");

        document.body.appendChild(temp);
        temp.innerHTML = currentNode.innerHTML;

        console.log("Temp size is: " + temp.clientWidth);

        utils.placeIn(modal, temp);
    }
};

core.defaultBeforeModeChange = function (oldmode, newmode) {

    var isDoc = (oldmode === "doc");
    var isDeck = (oldmode === "deck");
    var isWalk = (oldmode === "walkthrough");

    //tidy away old changes
    var slideWall = document.getElementById("slideWall");
    utils.classed(slideWall, "slide-backdrop", false);

    var slideHolder = document.getElementById("slideHolder");
    utils.classed(slideHolder, "slide-holder", false);


    var modal = document.getElementById("modal");
    utils.classed(modal, "slide-box", false);
    utils.classed(modal, "not-displayed", true);

};

core.defaultAfterModeChange = function (oldmode, newmode) {
    var isDoc = (newmode === "doc");
    var isDeck = (newmode === "deck");
    var isWalk = (newmode === "walkthrough");

    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", isDoc);
    }

    var slideWall = document.getElementById("slideWall");
    utils.classed(slideWall, "slide-backdrop", isDeck);
    slideWall.setAttribute("style", "opacity: " + c.modalBackdropOpacity);

    var slideHolder = document.getElementById("slideHolder");
    utils.classed(slideHolder, "slide-holder", isDeck);


    var modal = document.getElementById("modal");
    utils.classed(modal, "slide-box", isDeck);
    utils.classed(modal, "not-displayed", !isDeck);

};


core.toggleMode = function () {
    state.toggleMode(core.defaultBeforeModeChange, core.defaultAfterModeChange);
    //fix location bar
    window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + mode + "#" + s.currentSlideName());
}


core.hashChanged = function (location) {
    console.log("Location changed!" + location);
    var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";

    var theSlideNum = utils.parseSlideNum(window.location.hash);
    var queryParams = utils.parseParams(window.location.search);
    state = new State(theSlideNum, queryParams["mode"]);
    //TODO pos move to contructor
    state.isDeck();
    state.populateNavs(utils.selects(selectString));
    core.defaultAfterModeChange("doc", state.mode());
    core.defaultAfter(state.currentSlideName());

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
                state.mode = k.modes[k.modes.length - 1]; // dirty little hack..... because it assumes toggle will wrap around and that doc is the first in the list.
                core.toggleMode();
                console.log("Mode reset to doc");

                break;
            case 37: // Left arrow
                console.log("Previous " + evt.keyCode);
                window.location.hash = state.previous(core.defaultBefore, core.defaultAfter);; //side effect on state            
                console.log("slide=" + state.currentSlideName() + " state.mode is " + state.mode());
                break;
            case 39: // Right arrow
                console.log("Next " + evt.keyCode);
                window.location.hash = state.next(core.defaultBefore, core.defaultAfter); // side effect on state
                console.log("slide=" + state.currentSlideName() + " state.mode is " + state.mode());
                break;
            case 83: //s
                if (evt.shiftKey) {
                    core.toggleMode(); //side effect on state.mode
                    console.log("current mode: " + state.mode());
                }
                break;
            case 84: //t
                if (evt.shiftKey) {
                    window.location.hash = "";
                    core.setMode(k.mode[0]);
                    console.log("current mode: " + state.mode());
                }
                break;
        };

    };
};


core.init = function () {
    var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";
    utils.number(utils.selects(selectString));



    //interactivity
    core.addKeyListeners();

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
    slideHolder.innerHTML = '<div style="float: left; width: 20%;">&nbsp;</div><div id="' + k.modal + '" style="float: left; width:60%">&nbsp;</div><div style="float: left; width: 20%;">&nbsp;</div>';


    //Put everything in the right state // side effect on state
    core.hashChanged(window.location);

    window.addEventListener("hashchange", function (e) {
        core.hashChanged(window.location);
    });
};


module.exports = core;
