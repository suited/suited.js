import modeutils from '../../utils';
import Mode from '../../mode';

let name = "lecture";

function beforeSlide() {
  
}

function afterSlide() {
  
}

function beforeModeChange() {
  //add listeners
  
}

function cleanUp() {
  
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))