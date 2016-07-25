import constants from '../../../../konstantes.js'
import utils from '../../../../utils.js'
import modeutils from '../../utils';
import Mode from '../../mode';
import zoom from '../../../../zoom'

let name = "lecture";

let body = window.document.body;


function beforeSlide() {
  
}

function afterSlide() {
  
}

function beforeModeChange() {
  //add listeners
  console.log("lectureMode beforeModeChange")
  zoom.setup();
  
}

function cleanUp() {
  console.log("lectureMode teardown")
  zoom.teardown();
}

let mode = new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))

mode.addCallback("ESC", function() {
  console.log("lecture mode seen ESC event");
  if(zoom.zoomLevel() !== 1) {
  console.log("zoom level = " + zoom.zoomLevel());
    zoom.out();
  }
});

mode.addCallback("KEY_PRESSED_40", function() {
  console.log("lecture mode seen down arrow event");
  if(zoom.zoomLevel() !== 1) {
    console.log("zoom level = " + zoom.zoomLevel());
    event.preventDefault();
    zoom.out();
  }
});

mode.addCallback("CLICK", function(state, event) {
  console.log("lecture mode seen CLICK event");
  event.preventDefault();
	zoom.to({ element: event.target, pan: false });
});

mode.addCallback("KEY_PRESSED_38", function(state, event) {
  // up arrow pressed
  console.log("lecture mode seen up arrow event");
  event.preventDefault();
  //TODO need to look up state currentSlide() to pass as target
  var elId = state.currentSlideName()
  var target = document.getElementById(elId);
	zoom.to({ element: target, pan: false });
});


export default mode;