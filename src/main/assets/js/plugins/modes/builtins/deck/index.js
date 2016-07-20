import utils from '../../../../utils';
import modeutils from '../../utils';
import Mode from '../../mode';

let name = "deck";

function beforeSlide(slideId) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);    
}


function afterSlide(slideId) {
    var currentNode = document.getElementById(slideId);

    utils.classed(currentNode, "slide-highlight", true);
    utils.classed(currentNode, "muted", true);

    var modal = document.getElementById("modal");

    //Need to copy - otherwise it is removed from the main document.
    var copy = document.createElement("div");
    copy.innerHTML = currentNode.innerHTML;

    utils.placeIn(modal, copy);
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

function cleanUp() {
    deckMode(false);
}

function beforeModeChange() {
    deckMode(true);
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))