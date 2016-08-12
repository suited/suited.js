/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   robertk
* @Last modified time: 2016-Aug-12
* @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

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



import constants from '../../../../konstantes.js'
import utils from '../../../../utils.js'
import modeutils from '../../utils';
import Mode from '../../mode';
import zoom from '../../../../zoom'

let name = "lecture";

let body = window.document.body;

let autozoom = false;


function beforeSlide(slideId, state, evData) {
  if(zoom.zoomLevel() !== 1) {
    console.log("lectire before slide change zoom out")
    zoom.out; }
}

function afterSlide(slideId, state, evData) {
  if(!!autozoom && zoom.zoomLevel() == 1) {
    //add a timout to allow for scroll and one to allow for unzoom first

var scrollDelay = (parseInt(constants.SCROLL_DELAY_DURATION) + parseInt(constants.SCROLL_DURATION));
var unzoomDelay = parseInt(constants.ZOOM_DURATION);
    var elId = state.currentSlideName()
    var target = document.getElementById(elId);

    window.setTimeout(
      function(){ console.log("about to zoom after delay"); zoom.to({ element: target, pan: false });  },
      (scrollDelay + unzoomDelay)
    );

  }
}


function beforeModeChange() {
  console.log("lectureMode beforeModeChange")

  var slides = utils.selects("section[data-slide]");
  for (var i = 0; i < slides.length; ++i) {
      utils.classed(slides[i], "not-displayed", true);
  }
  zoom.setup();

}

function cleanUp() {
  console.log("lectureMode teardown");
  zoom.out();
  zoom.teardown();
}

function toggleZoom(state, event){
  if(zoom.zoomLevel() !== 1) {
    console.log("zoom level = " + zoom.zoomLevel());
    event.preventDefault();
    zoom.out();
  } else {
    event.preventDefault();
    //TODO need to look up state currentSlide() to pass as target
    console.log("togglezoom zoomin level = " + zoom.zoomLevel())
    var elId = state.currentSlideName()
    var target = document.getElementById(elId);

    console.log("togglezoom elId = " + elId + "  target="+ target);
  	zoom.to({ element: target, pan: false });
  }
}


function delayForZoom(callback, arg1){
  if(zoom.zoomLevel() !== 1) {
    zoom.out();
    window.setTimeout(callback, constants.ZOOM_DURATION, arg1)
  } else {
    callback(arg1);
  }

 };
var transitions = [];


var scrollNZoom = { "name": "scrollNZoom" }
scrollNZoom.top = function(elId) { delayForZoom( constants.defaultTransitions.scroll.top, elId ) }
scrollNZoom.left = function(elId) { delayForZoom( constants.defaultTransitions.scroll.left, elId ) }
scrollNZoom.right = function(elId) { delayForZoom( constants.defaultTransitions.scroll.right, elId ) }
scrollNZoom.up = function(elId) { delayForZoom( constants.defaultTransitions.scroll.left, elId ) }
scrollNZoom.down = function(elId) { delayForZoom( constants.defaultTransitions.scroll.right, elId ) }

transitions.push( scrollNZoom );
transitions.push(constants.defaultTransitions.jump);

let mode = new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name), transitions);


mode.handlesEvent = function (eventName) {
  return eventName === "ESC";
}

//Handle custon Events
mode.addCallback("ESC", function() {
  console.log("lecture mode seen ESC event");
  if(zoom.zoomLevel() !== 1) {
  console.log("zoom level = " + zoom.zoomLevel());
    zoom.out();
  }
});

mode.addCallback("ENTER", function(state, event) {
  console.log("lecture mode seen ENTER event. toggle zoom");
  toggleZoom(state, event);
});

mode.addCallback("CLICK", function(state, event) {

  console.log("+++++++++++++ lecture mode seen CLICK event: "+ JSON.stringify(event));
  event.preventDefault();
	zoom.to({ element: event.target, pan: false });
});

// shift z pressed - toggle autozoom
mode.addCallback("KEY_PRESSED_90", function(state, event) {
  if (event.shiftKey) {
    console.log("lecture mode seen Shift-z click event");
    event.preventDefault();
    autozoom = !autozoom;
  }
});

//cycle transition
mode.addCallback("KEY_PRESSED_89", function(state, event) {

    console.log("lecture mode seen 'y' click event");
    event.preventDefault();
    var currentT = mode.selectedTransition;
    console.log(" currentT "+ currentT);
    var nextI = 0;
    if(!!currentT) {
      transitions.forEach(function (d,i,a){
        if(d.name === currentT) {
          // console.log("lecture mode selectedTransition: found " + currentT + " at i="+ i);
          nextI = ++i;
          // console.log("nextI: " + nextI);

        }
      })
    }

    if(nextI >= transitions.length) {
      // console.log(" nexti "+ nextI +" >= "+ transitions.length);
      mode.selectedTransition = transitions[0].name
      // console.log("lecture mode selectedTransition: " + mode.selectedTransition);
    } else {
      // console.log(" nexti "+ nextI +" ! >= "+ transitions.length);
        mode.selectedTransition = transitions[nextI].name
        // console.log("lecture mode selectedTransition: " + mode.selectedTransition);
    }

});

mode.addCallback("ModeCSSFree", function(state, eventdata) {
  var modeCss = document.getElementById(eventdata.styleId)
  modeCss.innerHTML="h1, h2, h3, h4, h5 { color: red; }"
});



export default mode;
