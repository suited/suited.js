'use strict';




/* Core features and management - eg finds and tags all slide elements */


    var konstants = require('./konstants.js')
    var konfig = require('./konfig.js')
    var utils = require('./utils.js');
    var state = require('./state.js');

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



    var core = function () {};

    core.maxModalWidth = 0;
    core.maxModalHeight = 0;

    core.showSlide = function () {
        var isDeck = state.isDeck();
        var isWalk = state.isWalkthrough();

        var slideWall = document.getElementById("slideWall");
        utils.classed(slideWall, "slide-backdrop", isDeck);
        slideWall.setAttribute("style", "opacity: " + c.modalBackdropOpacity);

        var slideHolder = document.getElementById("slideHolder");
        utils.classed(slideHolder, "slide-holder", isDeck);

        utils.classed(state.previousNode(), "slide-highlight", false);
        utils.classed(state.previousNode(), "muted", false);

        var currentNode = state.currentNode();
        utils.classed(currentNode, "slide-highlight", isDeck || isWalk);
        utils.classed(currentNode, "muted", isDeck || isWalk);

        var modal = document.getElementById("modal");
        utils.classed(modal, "slide-box", isDeck);
        utils.classed(modal, "not-displayed", !isDeck);
        //modal.innerHTML = state.currentNode().innerHTML;

        var temp = document.createElement("div");
        temp.setAttribute("style", "display: inline-block; visible: false;");

        document.body.appendChild(temp);
        temp.innerHTML = currentNode.innerHTML;

        console.log("Temp size is: " + temp.clientWidth);

        utils.placeIn(modal, temp);
    }

    core.highlightFunc = core.showSlide; //Idea is to have dynamic highlight functions when changing the mode;

    core.displays = {
        slideDeck: core.showSlide,
        walkthrough: core.showSlide,
        doc: core.showSlide
    };



    //TODO check if attr Values is an array or a function(dia) and call it to set the values
    /* attValues is an array of values or a function(index, origArray) that returns the value for each item in the array */
    core.tag = function (nodeList, attrName, attrValues) {
        for (var i = 0; i < nodeList.length; ++i) {
            var theValue = (!attrValues) ? '' : attrValues(i);
            nodeList[i].setAttribute(attrName, theValue);

        }
    };

    core.wrapDiv = function (element, id, clazz) {
        var theHtml = element.innerHTML;
        var newHtml = '<div class="' + clazz + '" id="' + id + '" >' + theHtml + '</div>';
        element.innerHTML = newHtml;
    }

    core.number = function (nodeList) {
        state.numSlides = nodeList.length - 1;

        //TODO FIXME ther is an error here I thing wrapping moves nodes so children slides are not wrapped...
        // ... perhaps wrap in reverse order?
        //        for (var i = 0; i < state.numSlides; ++i) {
        for (var i = (state.numSlides); i >= 0; i--) {
            var item = nodeList[i]; // Calling myNodeList.item(i) isn't necessary in JavaScript
            core.wrapDiv(item, "slide-" + i, "slide");
            var childSlides = utils.selects("section[data-slide]", item);
            core.tag(childSlides, "data-sub-slide");
        }
    };

    core.changeHighlightFunc = function (mode) {

        core.highlightFunc = core.showSlide; // The highlightFunc can be updated here based on mode. For now all the same function
    }

    core.toggleMode = function () {
        state.toggleMode();
        core.changeHighlightFunc(state.mode);

        window.history.pushState("", window.title, window.location.origin + window.location.pathname + "?mode=" + state.mode + "#" + state.slideName());
        console.log("slide=" + state.slideName() + " state.mode is " + state.mode);

        core.highlightFunc();
    }


    core.hashChanged = function (location) {
        console.log("Location changed!" + location);

        var paramMap = utils.parseParams(location.search);

        state.change(paramMap);
    };


    /**
     * Handle the shortcuts and arrow navigation
     * 
     * keycodes are: left = 37, up = 38, right = 39, down = 40
     */
    core.key = function () {

        document.onkeyup = function (evt) {
            var kc = evt.keyCode;
            switch (kc) {
                case 27: //escape
                    state.mode = k.mode[k.mode.length - 1]; // dirty little hack..... because it assumes toggle will wrap around and that doc is the first in the list.
                    core.toggleMode();
                    console.log("Mode reset to doc");

                    break;
                case 37: // Left arrow
                    console.log("Previous " + evt.keyCode);

                    var current = state.currentNum;
                    var nextSlide = state.previous();
                    if (current == state.currentNum) {
                        nextSlide = "";
                    }

                    window.location.hash = nextSlide; //side effect on state            
                    console.log("slide=" + state.slideName() + " state.mode is " + state.mode);

                    break;
                case 39: // Right arrow
                    console.log("Next " + evt.keyCode);
                    window.location.hash = state.next(); // side effect on state
                    console.log("slide=" + state.slideName() + " state.mode is " + state.mode);

                    break;
                case 83: //s
                    if (evt.shiftKey) {
                        core.toggleMode(); //side effect on state.mode
                        console.log("current mode: " + state.mode);
                    }
                    break;
                case 84: //t
                    if (evt.shiftKey) {
                        window.location.hash = "";
                        core.setMode(k.mode[0]);
                        console.log("current mode: " + state.mode);
                    }
                    break;
            };

        };
    };


    core.init = function () {
        core.number(utils.selects("section[" + k.slideAttr + "]"));
        core.key();

        // add placeholder for Modal backdrop
        var b = document.body;

        var slideWall = document.createElement("div");
        slideWall.setAttribute("id", k.modalBackdrop);
        b.appendChild(slideWall);

        var slideHolder = document.createElement("div");
        slideHolder.setAttribute("id", k.slideHolder);
        b.appendChild(slideHolder);

        //Add the modal backdrop element
        slideHolder.innerHTML = '<div style="float: left; width: 20%;">&nbsp;</div><div id="' + k.modal + '" style="float: left; width:60%">&nbsp;</div><div style="float: left; width: 20%;">&nbsp;</div>';

        //Default display function is doc.        
        state.highlightFunc = core.displays.doc;

        //Put everything in the right state
        core.hashChanged(window.location);

        window.addEventListener("hashchange", function (e) {
            core.hashChanged(window.location);
        });
    };


module.exports = core;
