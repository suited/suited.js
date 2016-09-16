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


function calcVerticalHeight(elem) {
  var result = elem.offsetHeight;

  var computedStyles = window.getComputedStyle(elem);
  result += parseInt(computedStyles.getPropertyValue('margin-top'));
  result += parseInt(computedStyles.getPropertyValue('margin-bottom'));

  return result;
}

/**
 * Remove elements with no name from the element list
 */
function stripNoNameElements(elems) {
  var result = elems.map(function(el) {
    if (el.tagName && el.tagName.trim().length > 0) {
      return el;
    }
  }).filter(function(el){
    if (el) return el;
  });

  return result;
}

/**
 * Place the element in the space reserved for the header if the first element
 * in the list is a header element.
 * SIDE EFFECT: If placed the element is sliced from the list and the rest is returned
 */
function placeHeaderIfPresent(header, elems) {
  var headers = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  if (elems.length > 0 && headers.indexOf(elems[0].tagName) >= 0) {
    header.appendChild(elems[0]);

    if (elems.length > 1) {
      elems = elems.slice(1);
    }
    else {
      elems = []
    }
  }
  return elems;
}

/**
 * Place the list of elements in the middle space. if an element is an image
 * then keep track of it to be resized later
 */
function placeElementsInMiddle(middle, elems, maxWidth, maxHeight) {
  var heightUsed = 0;

  var images = [];
  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];

    //Support free floating text in a slide section by wrapping it in a P
    elem = wrapIn_P_IfNecessary(elem);
    elem = ripImageFrom_P_IfApplicable(elem);

    if (elem.tagName && elem.tagName.toUpperCase() == 'IMG') {
      var imgcontainer =  document.createElement("div");
      utils.classed(imgcontainer, "image", true);
      imgcontainer.appendChild(elem);
      middle.appendChild(imgcontainer);
      //image don't contribute to height used because we make them fit later
      images.push(elem);
    }
    else if (elem.tagName) {
      var tag = elem.tagName.toUpperCase();
      middle.appendChild(elem);
      heightUsed += calcVerticalHeight(elem);
    }
  }

  if (images.length > 0) {
    resizeImages(images, (maxHeight - heightUsed), maxWidth);
  }
}

/**
 * If the element is a <p> with an <img> as the only child, then return the <img>
 */
function ripImageFrom_P_IfApplicable(elem) {
  if (elem.tagName && elem.tagName.toUpperCase() == 'P') {
    //check if only one child and that child is an image then rip it out
    if (elem.childNodes.length == 1 && elem.childNodes[0].tagName && elem.childNodes[0].tagName == 'IMG') {
      elem = elem.childNodes[0];
    }
  }
  return elem;
}

/**
 * If the element is a free floating text element, wrap it in a <p>
 */
function wrapIn_P_IfNecessary(elem) {
  if (!elem.tagName && elem.textContent.trim().length > 0) {
    var txtWrapper = document.createElement("p");
    txtWrapper.appendChild(elem);
    elem = txtWrapper;
  }
  return elem;
}

/**
 * Go through the list of images and resize them based on available space
 **/
function resizeImages(images, heightAvailable, widthAvailable) {
  var maxHeightPerImage = 1.0 * heightAvailable / images.length;

  for (var i=0; i < images.length; i++ ) {
    var img = images[i];

    var imgH = img.naturalHeight;
    var imgW = img.naturalWidth;
    var isPortrait = imgH > imgW;
    var aspectRatio = imgH / (1.0*imgW);

    var newImgH = 0;
    var newImgW = 0;
    //first see if our image is too tall already or is a portrait
    if (isPortrait) {
      newImgH = maxHeightPerImage;
      newImgW = newImgH * (1.0/aspectRatio)
    }
    else {
      newImgW = widthAvailable;
      newImgH = newImgW * aspectRatio;
    }

    if (newImgH > maxHeightPerImage) {
      console.log("Limiting by height: " + maxHeightPerImage);
      utils.styled(img, "height", maxHeightPerImage + "px");
      utils.styled(img, "width", "auto");
    }
    else {
      console.log("Limiting by width: " + widthAvailable);
      utils.styled(img, "width", widthAvailable + "px");
      utils.styled(img, "height", "auto");
    }
  }
}

/**
 * Place the elements of the child in the container
 **/
function placeIn(container, child) {
  container.innerHTML = "";
  utils.classed(container, "slide-root", true);

  //Clean the contents of the child and get element list
  var elems = Array.prototype.slice.call(child.childNodes);
  elems = stripNoNameElements(elems);

  //Add a special place for the header
  var header = document.createElement("div");
  utils.classed(header, "header", true);
  container.appendChild(header);

  elems = placeHeaderIfPresent(header, elems);

  //Add the body section where all the elemnts go
  var middle = document.createElement("div");
  container.appendChild(middle);
  utils.classed(middle, "middle", true);

  //Now add the elements
  var maxWidth = middle.clientWidth;
  var maxHeight = (middle.clientHeight - header.offsetHeight - 30);
  utils.styled(middle, "height", maxHeight + "px");

  placeElementsInMiddle(middle, elems, maxWidth, maxHeight);
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
  //  slideWall.setAttribute("style", "opacity: 60%"); //TODO should be a scss variable

    var slideHolder = document.getElementById("slideHolder");
    utils.classed(slideHolder, "slide-holder", enable);

    var modal = document.getElementById("modal");
    utils.classed(modal, "slide-box", enable);
    utils.classed(modal, "invisible", !enable);
}

function cleanUp(state) {
    beforeSlide(state.currentSlideName());
    deckMode(false);
}

function beforeModeChange() {
    deckMode(true);
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))
