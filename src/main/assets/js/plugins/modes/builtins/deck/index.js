/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   dirk
* @Last modified time: 2016-08-15T22:15:30+10:00
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

let name = "deck";



function placeIn(container, child) {
  container.innerHTML = "";
  var header = document.createElement("div");
  utils.classed(header, "header", true);
  container.appendChild(header);
  var middle = document.createElement("div");
  utils.classed(middle, "middle", true);
  container.appendChild(middle);

  var elems = Array.prototype.slice.call(child.childNodes);
  elems = elems.map(function(el) {
    if (el.tagName && el.tagName.trim().length > 0) {
      return el;
    }
  }).filter(function(el){
    if (el) return el;
  });

//  var wrapper = document.createElement("div");
  utils.classed(container, "slide-root", true);

  var headers = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  if (elems.length > 0 && headers.indexOf(elems[0].tagName) >= 0) {
    header.appendChild(elems[0]);
    if (elems.length > 1) {
      elems = elems.slice(1);
    }
  }

  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];

    //Support free floating text in a slide section by wrapping it in a P
    if (!elem.tagName && elem.textContent.trim().length > 0) {
      var txtWrapper = document.createElement("p");
      txtWrapper.appendChild(elem);
      elem = txtWrapper;
    }

    if (elem.tagName) {
      var tag = elem.tagName.toUpperCase();
      middle.appendChild(elem);
    }
    
  }
}

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

    placeIn(modal, copy);
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

function cleanUp(state) {
    beforeSlide(state.currentSlideName());
    deckMode(false);
}

function beforeModeChange() {
    deckMode(true);
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))
