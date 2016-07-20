import utils from '../../../../utils';
import modeutils from '../../utils';
import Mode from '../../mode';

let name = "walkthrough";

function beforeSlide(slideId) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);    
}

function afterSlide(slideId) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", true);
    utils.classed(currentNode, "muted", true);
}

function walkMode(enable) {
    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", enable);
    }
}

function beforeModeChange() {
    walkMode(true);
}

function cleanUp() {
    walkMode(false);
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))