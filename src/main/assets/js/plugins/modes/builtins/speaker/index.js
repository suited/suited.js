/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-02
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



import utils from '../../../../utils';
import modeutils from '../../utils';
import Mode from '../../mode';

let name = "speaker";

function beforeSlide(slideId, state, evData) {
  var previousNode = document.getElementById(state.previous());
  utils.classed(previousNode, "slide-highlight", false);
  utils.classed(previousNode, "previous", false);

    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "current", false);

    var nextNode = document.getElementById(state.next());
    utils.classed(nextNode, "slide-highlight", false);
    utils.classed(nextNode, "next", false);
}

function afterSlide(slideId, state, evData) {
  var previousNode = document.getElementById(state.previous());
  utils.classed(previousNode, "slide-highlight", true);
  utils.classed(previousNode, "previous", true);

    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", true);
    utils.classed(currentNode, "current", true);

    var nextNode = document.getElementById(state.next());
    utils.classed(nextNode, "slide-highlight", true);
    utils.classed(nextNode, "next", true);
}


function beforeModeChange(state, evData) {
    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", false);
    }
    //register a listener for the STORAGE event
    window.addEventListener('storage', function(evt){
      // alert('The modified key was '+evt.key);
    // alert('The original value was '+evt.oldValue);
    // alert('The new value is '+evt.newValue);
    // alert('The URL of the page that made the change was '+evt.url);
    // alert('The window where the change was made was '+evt.source);
      window.suited.fireEvent("STORAGE", state, evt);
    }, false);
}

function cleanUp() {

}

let mode =  new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, null, null)

mode.addCallback("STORAGE", function(state, event, evData) {
  console.log("speaker mode seen STORAGE event. change slide");
  if(event.key == "suited-slide-num"){
      console.log("speaker mode seen STORAGE event. oldval=" + event.oldValue + " newval="+ event.newValue);
      if(state.currentSlideName() !== event.newValue) {
        console.log("speaker mode seen STORAGE event. LETS GO THERE curr="+state.currentSlideName() + " new="+event.newValue);
        // state.setSlideNumber(state.getSlideNumFromName(event.newValue));
        window.suited.fireEvent("GoToSlide", state, event.newValue);
      }else {
        console.log("speaker mode seen STORAGE event. SAME PAGE DO NOTHING");
      }
  } else {
    console.log("speaker mode seen STORAGE event. NOWT for ME");
  }
  return {
    'state': state
      //,'value': "BeforeStateChange Magic Value1"
  }
});

export default mode
