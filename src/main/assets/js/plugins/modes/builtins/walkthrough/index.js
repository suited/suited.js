import utils from '../../../../utils';
import modeutils from '../../utils';
import Mode from '../../mode';

let name = "walkthrough";

function beforeSlide(slideId, state, evData) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);
}

function afterSlide(slideId, state, evData) {
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

function beforeModeChange(state, evData) {
    walkMode(true);
}

function cleanUp() {
    walkMode(false);

    //remove lingering css changes
    var highligted = utils.selects(".slide-highlight");
    for (var i = 0; i < highligted.length; ++i) {
      utils.classed(highligted[i], "slide-highlight", false);
    }
    var muted = utils.selects(".muted");
    for (var i = 0; i < muted.length; ++i) {
      utils.classed(muted[i], "muted", false);
    }
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))
