
import utils from '../../../../utils';

const EMPTY = 0;
const HEADING = 1;
const BULLETS = 2;
const TEXT = 4;
const CODE = 8;
const IMG = 16;
const QUOTE = 32;
const UNKNOWN = 64;

function calcVerticalHeight(elem) {
  var result = elem.offsetHeight;

  var computedStyles = window.getComputedStyle(elem);
  result += parseInt(computedStyles.getPropertyValue('margin-top'));
  result += parseInt(computedStyles.getPropertyValue('margin-bottom'));

  return result;
}

function isElem(elem, name) {
    return elem.tagName.toUpperCase() === name;
}

function isHeading(elem) {
    return  elem.tagName.toUpperCase()[0] === "H";
}

function isImage(elem) {
    return isElem(elem, "IMG");
}

function isBullets(elem) {
    return isElem(elem, "UL") || isElem(elem, "OL") || isElem(elem, "LI");
}

function isText(elem) {
    return isElem(elem, "P") || isElem(elem, "SPAN") || isElem(elem, "I") || isElem(elem, "B");
}

function isCode(elem) {
    return isElem(elem, "PRE");
}

function isImage(elem) {
    return isElem(elem, "IMG");
}

function isQuote(elem) {
    return isElem(elem, "BLOCKQUOTE") || isElem(elem, "Q");
}

function isFeeText(elem) {
    return !elem.tagName && elem.textContent.trim().length > 0;
}

/**
 * Assumes the elements all have tag names
 * 
 * @returns bitmask of the types of elements on the slide
 */
function calcSlideCategory(elems) {

    var types = EMPTY; 


    if (!!elems && elems.length > 0) {   
        if (isHeading(elems[0])) {
            types = types | HEADING;
        }

        elems.forEach(function(elem){
            if (isBullets(elem)) {
                types = types | BULLETS;
            }        
            else if (isText(elem)) {
                types = types | TEXT;
            }        
            else if (isCode(elem)) {
                types = types | CODE;
            }        
            else if (isImage(elem)) {
                types = types | IMG;
            }
            else if (isQuote(elem)) {
                types = types | QUOTE;
            }
            else {
                console.warn("Don't know the type of element: " + elem.tagName);
                types = types | UNKNOWN;
            }

        });
    }

    return types;
}

/**
 * If the element is a <p> with an <img> as the only child, then return the <img>
 */
function stripPfromImages(elems) {
    var result = [];

    elems.forEach(function(elem) {
        if (isElem(elem, 'P')) {
            //check if only one child and that child is an image then rip it out
            if (elem.childNodes.length == 1 && elem.childNodes[0].tagName) {
                child = elem.childNodes[0];
                if (isElem(child,'IMG')) {
                    result.push(elem.childNodes[0]);
                }
            }
        }
        else {
            result.push(elem);
        }
    });

    return result;
}

/**
 * If the element is a free floating text element, wrap it in a <p>
 */
function wrapTextInP(elems) {
    var result = [];

    elems.forEach(function(elem) {
        if (isFeeText(elem)) {
            var txtWrapper = document.createElement("p");
            txtWrapper.appendChild(elem);
            result.push(txtWrapper);
        }
        else {
            result.push(elem);
        }
    });
    return result;
}

/**
 * Remove elements with no name from the element list
 */
function stripNoNameElements(elems) {
    return elems.filter(function(e) {
        return (!!e && !!e.tagName && e.tagName.length > 0)
    });
}

function copyNodeChildElements(slideId) {

    var currentNode = document.getElementById(slideId);

    //First copy to a new div
    var copy = document.createElement("div");
    copy.innerHTML = currentNode.innerHTML;

    var elems = Array.prototype.slice.call(copy.childNodes);
    console.log("SLIDE: Found: " + elems.length + " elements on slide: " + slideId);

    elems = stripNoNameElements(elems);
    elems = wrapTextInP(elems);
    elems = stripPfromImages(elems);

    console.log("SLIDE: After processing, copied: " + elems.length + " elements from slide: " + slideId);

    return elems;
}

/**
 * Go through the list of images and resize them based on available space
 **/
function resizeImagesToFit(images, heightAvailable, widthAvailable) {
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

    console.log("Resize:- is portrait:" + isPortrait);
    console.log("Resize:- Image: H" + imgH + " W:" + imgW);
    console.log("Resize:- NEW Image: H" + newImgH + " W:" + newImgW);
    console.log("Resize:- MAX HEIGHT: " + maxHeightPerImage);
    console.log("Resize:- MAX WIDTH: " + widthAvailable);

    if (newImgH >= maxHeightPerImage || isPortrait) {
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


function placeIn(modal, elems) {
    var category = calcSlideCategory(elems);
    var nonImageHeightUsed = 0;
    var images = []

    if (category & HEADING) {
        var head = document.createElement("div");
        head.appendChild(elems[0]);
        modal.appendChild(head);

        nonImageHeightUsed += calcVerticalHeight(head);
        elems.slice(1);
    }

    elems.forEach(function(elem) {
        if (isImage(elem)) {
            images.push(elem);
        }
        else {
            nonImageHeightUsed += calcVerticalHeight(elem);
        }
        modal.appendChild(elem);
    });

    //Fix image sizes so they fit:
    var maxWidth = modal.clientWidth;
    var maxHeight = modal.clientHeight;
    resizeImagesToFit(images, (maxHeight - nonImageHeightUsed), maxWidth);
}


export function onBeforeSlideChange(slideId) {
    
    console.log("SLIDE: onBeforeSlideChange(" + slideId + ")");
    //Why these?    

    //var currentNode = document.getElementById(slideId);
    // utils.classed(currentNode, "slide-highlight", false);
    // utils.classed(currentNode, "muted", false);
}


export function onAfterSlideChange(slideId) {

    //Need to copy - otherwise it is removed from the main document.
    var elems = copyNodeChildElements(slideId);
    var modal = document.getElementById("modal");

    modal.innerHTML = "";
    placeIn(modal, elems);
}

export function onBeforeModeChange() {
    deckMode(true);
}

export function onAfterModeChange() {}

export function onCleanUp() {
    onBeforeSlideChange(state.currentSlideName());
    deckMode(false);    
}


function deckMode(enable) {
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; i++) {
        utils.classed(slides[i], "not-displayed", !enable);
    }

    var slideWall = document.getElementById("slideWall");
    utils.classed(slideWall, "slide-backdrop", enable);
    // utils.classed(slideWall, "container", enable);

    var slideHolder = document.getElementById("slideHolder");
    utils.classed(slideHolder, "slide-holder", enable);

    var modal = document.getElementById("modal");
    utils.classed(modal, "slide-box", enable);
    utils.classed(modal, "invisible", !enable);
}