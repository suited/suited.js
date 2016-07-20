import utils from '../../../../utils';
import modeutils from '../../utils';
import Mode from '../../mode';

let name = "doc";

function beforeSlide(slideId) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);    
}

function afterSlide(slideId) {
    beforeSlide(slideId);
}

function beforeModeChange() {
    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", true);
    }
}

function cleanUp() {
  
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, null, modeutils.getShouldShowSlideFunction(name))