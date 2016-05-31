'use strict';

var Mode = require('./mode.js');
var utils = require('../../utils.js');

function defaultBeforeSlide(slideId) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);    
}

function docAfterSlide(slideId) {
    defaultBeforeSlide(slideId);
}

function deckAfterSlide(slideId) {
    var currentNode = document.getElementById(slideId);

    utils.classed(currentNode, "slide-highlight", true);
    utils.classed(currentNode, "muted", true);

    var modal = document.getElementById("modal");

    //Need to copy - otherwise it is removed from the main document.
    var copy = document.createElement("div");
    copy.innerHTML = currentNode.innerHTML;

    utils.placeIn(modal, copy);
}

function walkAfterSlide(slideId) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", true);
    utils.classed(currentNode, "muted", true);
}

function deckMode(enable) {
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", !enable);
    }
    
    var slideWall = document.getElementById("slideWall");
    utils.classed(slideWall, "slide-backdrop", enable);
    utils.classed(slideWall, "container", enable);
    slideWall.setAttribute("style", "opacity: 60%"); //TODO should be a scss variable    

    var slideHolder = document.getElementById("slideHolder");
    utils.classed(slideHolder, "slide-holder", enable);    
      
    var modal = document.getElementById("modal");
    utils.classed(modal, "slide-box", enable);
    utils.classed(modal, "not-displayed", !enable);    
}

function deckCleanUp() {
    deckMode(false);
}

function deckBeforeModeChange() {
    deckMode(true);
}

function docBeforeModeChange() {
    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", true);
    }
}

function walkMode(enable) {
    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", enable);
    }
}

function walkBeforeModeChange() {
    walkMode(true);
}

function walkCleanUp() {
    walkMode(false);
}


function getShouldShowSlideFunction(mode) {
    if (mode === "deck") {
        return function (slideType) {return slideType === "figure" || slideType === "slide";}
    }
    else {
        return function (slideType) {return slideType === "figure";}
    }
}

var ml = {};
ml.modes = [];
ml.modes.push(new Mode("doc", defaultBeforeSlide, docAfterSlide, docBeforeModeChange, null, null, getShouldShowSlideFunction("doc")));
ml.modes.push(new Mode("deck", defaultBeforeSlide, deckAfterSlide, deckBeforeModeChange, null, deckCleanUp, getShouldShowSlideFunction("deck")));
ml.modes.push(new Mode("walkthrough", defaultBeforeSlide, walkAfterSlide, walkBeforeModeChange, null, walkCleanUp, getShouldShowSlideFunction("walkthrough")));

module.exports = ml;